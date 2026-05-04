import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { PoLoadingModule, PoNotificationService, PoPageAction, PoPageModule, PoProgressModule, PoProgressStatus, PoTagModule, PoTagType } from '@po-ui/ng-components';
import * as OBC from '@thatopen/components';
import * as FRAGS from '@thatopen/fragments';
import * as THREE from 'three';

export interface IfcProperty {
  name: string;
  value: string;
  unit?: string;
  type?: string;
}

export interface IfcPropertyGroup {
  name: string;
  properties: IfcProperty[];
  isExpanded: boolean;
}

export interface IfcNode {
  id: string;
  localId: number | null;
  category: string;
  name: string;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  children: IfcNode[];
}

interface SpatialNode {
  category: string | null;
  localId: number | null;
  children?: SpatialNode[];
}

@Component({
  selector: 'app-ifc-viewer',
  templateUrl: './ifc-viewer.html',
  styleUrls: ['./ifc-viewer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PoPageModule, PoLoadingModule, PoTagModule, PoProgressModule, CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll],
})
export class IfcViewer implements OnInit, OnDestroy {
  private containerRef = viewChild<ElementRef<HTMLDivElement>>('viewerContainer');
  private treeViewport = viewChild<CdkVirtualScrollViewport>('treeViewport');

  protected isLoading = signal(false);
  protected modelLoaded = signal(false);
  protected loadingMessage = signal('');
  protected loadingProgress = signal(0);
  protected loadedFileName = signal('');
  protected treeNodes = signal<IfcNode[]>([]);
  protected filteredTreeNodes = signal<IfcNode[]>([]);
  protected searchText = signal('');
  protected isTreeLoading = signal(false);
  protected treePanelVisible = signal(true);
  protected darkBackground = signal(true);

  // Painel de propriedades (propPanelX = distância da borda direita)
  protected propPanelVisible = signal(false);
  protected propPanelMinimized = signal(false);
  protected propPanelX = signal(16);
  protected propPanelY = signal(16);
  protected propPanelW = signal(320);
  protected propPanelH = signal(700);
  protected propertyGroups = signal<IfcPropertyGroup[]>([]);
  protected isPropsLoading = signal(false);
  protected selectedObjectName = signal('');

  // Painel flutuante: posição e tamanho
  protected panelX = signal(16);
  protected panelY = signal(16);
  protected panelW = signal(420);
  protected panelH = signal(700);

  protected readonly tagType = PoTagType.Success;
  protected readonly progressStatus = PoProgressStatus.Default;

  protected readonly pageActions: PoPageAction[] = [
    {
      label: 'Abrir arquivo IFC',
      icon: 'an an-upload',
      action: () => this.triggerFileInput(),
    },
    {
      label: 'OTC-Conference Center.ifc',
      icon: 'an an-cloud-download',
      action: () => this.loadFromUrl(
        'https://mkazimoto.github.io/AppAngularPOUICopilot/ifc/OTC-Conference%20Center.ifc',
        'OTC-Conference Center.ifc'
      ),
    },
  ];

  private components: OBC.Components | null = null;
  private world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer> | null = null;
  private fragments: OBC.FragmentsManager | null = null;
  private ifcLoader: OBC.IfcLoader | null = null;
  private rootNodes: IfcNode[] = [];
  private nodeCounter = 0;
  private currentLoadedModel: ReturnType<OBC.FragmentsManager['list']['get']> | null = null;
  private selectedFragments = new Set<string>();
  private selectedLocalIds: number[] = [];
  private selectedNodeId: string | null = null;
  private hoveredLocalId: number | null = null;
  private viewerCanvas: HTMLCanvasElement | null = null;
  private hoverRafId: number | null = null;
  private localIdToNode = new Map<number, IfcNode>();

  // Drag state (shared between panels)
  private activeDragPanel: 'tree' | 'props' | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragOriginX = 0;
  private dragOriginY = 0;

  // Resize state (shared between panels)
  private activeResizePanel: 'tree' | 'props' | null = null;
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeOriginW = 0;
  private resizeOriginH = 0;
  private resizeOriginX = 0;
  private resizeOriginY = 0;
  private resizeDirection: 'corner' | 'left' | 'right' | 'top' | 'bottom' = 'corner';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly onViewerClick = async (e: MouseEvent) => {
    if (!this.currentLoadedModel || !this.world || !this.viewerCanvas) return;
    const mouse = new THREE.Vector2(e.clientX, e.clientY);
    try {
      const result = await this.currentLoadedModel.raycast({
        camera: this.world.camera.three,
        mouse,
        dom: this.viewerCanvas,
      });
      if (result === null) return;
      const node = this.localIdToNode.get(result.localId);
      if (!node) return;

      // Expande ancestrais para o nó ficar visível na lista
      this.expandToNode(node);

      // Seleciona no modelo 3D
      this.selectedNodeId = node.id;
      await this.highlightNodeInModel(node);

      // Carrega propriedades do objeto selecionado
      if (node.localId !== null) {
        this.loadProperties(node.localId, node.name);
      }

      // Garante que a lista plana está atualizada no viewport antes do scroll
      this.cdr.detectChanges();

      // Scroll na tree view até o nó selecionado (aguarda o próximo frame para o viewport processar os dados)
      const index = this.filteredTreeNodes().findIndex(n => n.id === node.id);
      if (index >= 0) {
        setTimeout(() => {
          this.treeViewport()?.scrollToIndex(index, 'instant');
        }, 0);
      }
      this.cdr.detectChanges();
    } catch {
      // ignora erros de raycast
    }
  };

  private readonly onViewerMouseMove = (e: MouseEvent) => {
    if (this.hoverRafId !== null) return;
    this.hoverRafId = requestAnimationFrame(() => {
      this.hoverRafId = null;
      this.processHover(e);
    });
  };

  private readonly onViewerMouseLeave = async () => {
    if (this.hoveredLocalId !== null && this.currentLoadedModel) {
      if (!this.selectedLocalIds.includes(this.hoveredLocalId)) {
        try {
          await this.currentLoadedModel.resetHighlight([this.hoveredLocalId]);
          this.fragments?.core.update(true);
        } catch { /* ignora */ }
      }
      this.hoveredLocalId = null;
    }
  };

  private hoverProcessing = false;

  private async processHover(e: MouseEvent): Promise<void> {
    if (!this.currentLoadedModel || !this.world || !this.viewerCanvas) return;
    if (this.hoverProcessing) return;
    this.hoverProcessing = true;

    const mouse = new THREE.Vector2(e.clientX, e.clientY);

    try {
      const result = await this.currentLoadedModel.raycast({
        camera: this.world.camera.three,
        mouse,
        dom: this.viewerCanvas,
      });

      const newHoveredId = result?.localId ?? null;

      if (newHoveredId === this.hoveredLocalId) return;

      // Limpa highlight de TODOS os objetos que não estão selecionados
      const toReset = this.hoveredLocalId !== null && !this.selectedLocalIds.includes(this.hoveredLocalId)
        ? [this.hoveredLocalId]
        : [];
      if (toReset.length > 0) {
        await this.currentLoadedModel.resetHighlight(toReset);
      }

      this.hoveredLocalId = newHoveredId;

      // Aplica destaque verde limão apenas no item sob o cursor
      if (newHoveredId !== null && !this.selectedLocalIds.includes(newHoveredId)) {
        const hoverMaterial: FRAGS.MaterialDefinition = {
          color: new THREE.Color(0x32cd32),
          opacity: 1,
          transparent: false,
          renderedFaces: FRAGS.RenderedFaces.TWO,
          depthTest: false,
        };
        await this.currentLoadedModel.highlight([newHoveredId], hoverMaterial);
      }
      this.fragments?.core.update(true);
    } catch {
      // Ignora erros de raycast silenciosamente
    } finally {
      this.hoverProcessing = false;
    }
  }

  private readonly onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      if (this.activeDragPanel === 'tree') {
        this.panelX.set(this.dragOriginX + (e.clientX - this.dragStartX));
        this.panelY.set(this.dragOriginY + (e.clientY - this.dragStartY));
      } else if (this.activeDragPanel === 'props') {
        // propPanelX é distância da borda direita: arrastar para esquerda aumenta o valor
        this.propPanelX.set(Math.max(0, this.dragOriginX - (e.clientX - this.dragStartX)));
        this.propPanelY.set(this.dragOriginY + (e.clientY - this.dragStartY));
      }
    }
    if (this.isResizing) {
      const deltaX = e.clientX - this.resizeStartX;
      const deltaY = e.clientY - this.resizeStartY;
      const xSignal = this.activeResizePanel === 'props' ? this.propPanelX : this.panelX;
      const ySignal = this.activeResizePanel === 'props' ? this.propPanelY : this.panelY;
      const wSignal = this.activeResizePanel === 'props' ? this.propPanelW : this.panelW;
      const hSignal = this.activeResizePanel === 'props' ? this.propPanelH : this.panelH;

      if (this.resizeDirection === 'corner') {
        const newW = Math.max(200, this.resizeOriginW + (this.activeResizePanel === 'props' ? -deltaX : deltaX));
        const newH = Math.max(150, this.resizeOriginH + deltaY);
        wSignal.set(newW);
        hSignal.set(newH);
      } else if (this.resizeDirection === 'left') {
        if (this.activeResizePanel === 'props') {
          // ancora direita: expandir esquerda só aumenta a largura
          wSignal.set(Math.max(200, this.resizeOriginW - deltaX));
        } else {
          const newW = Math.max(200, this.resizeOriginW - deltaX);
          const newX = this.resizeOriginX + deltaX;
          wSignal.set(newW);
          xSignal.set(newX);
        }
      } else if (this.resizeDirection === 'right') {
        if (this.activeResizePanel === 'props') {
          // ancora direita: expandir direita aumenta right e a largura
          wSignal.set(Math.max(200, this.resizeOriginW - deltaX));
          xSignal.set(Math.max(0, this.resizeOriginX + deltaX));
        } else {
          wSignal.set(Math.max(200, this.resizeOriginW + deltaX));
        }
      } else if (this.resizeDirection === 'top') {
        const newH = Math.max(150, this.resizeOriginH - deltaY);
        const newY = this.resizeOriginY + deltaY;
        hSignal.set(newH);
        ySignal.set(newY);
      } else if (this.resizeDirection === 'bottom') {
        const newH = Math.max(150, this.resizeOriginH + deltaY);
        hSignal.set(newH);
      }
    }
  };

  private readonly onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  private readonly onTouchMove = (e: TouchEvent) => {
    if (!this.isDragging && !this.isResizing) return;
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    e.preventDefault();
  };

  private readonly onTouchEnd = () => {
    this.onMouseUp();
  };

  protected onDragStart(panel: 'tree' | 'props', e: MouseEvent): void {
    this.isDragging = true;
    this.activeDragPanel = panel;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragOriginX = panel === 'tree' ? this.panelX() : this.propPanelX();
    this.dragOriginY = panel === 'tree' ? this.panelY() : this.propPanelY();
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  protected onDragStartTouch(panel: 'tree' | 'props', e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.isDragging = true;
    this.activeDragPanel = panel;
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.dragOriginX = panel === 'tree' ? this.panelX() : this.propPanelX();
    this.dragOriginY = panel === 'tree' ? this.panelY() : this.propPanelY();
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  protected onResizeStart(panel: 'tree' | 'props', direction: 'corner' | 'left' | 'right' | 'top' | 'bottom', e: MouseEvent): void {
    this.isResizing = true;
    this.activeResizePanel = panel;
    this.resizeDirection = direction;
    this.resizeStartX = e.clientX;
    this.resizeStartY = e.clientY;
    this.resizeOriginW = panel === 'tree' ? this.panelW() : this.propPanelW();
    this.resizeOriginH = panel === 'tree' ? this.panelH() : this.propPanelH();
    this.resizeOriginX = panel === 'tree' ? this.panelX() : this.propPanelX();
    this.resizeOriginY = panel === 'tree' ? this.panelY() : this.propPanelY();
    document.body.style.userSelect = 'none';

    if (direction === 'corner') {
      document.body.style.cursor = 'nwse-resize';
    } else if (direction === 'left' || direction === 'right') {
      document.body.style.cursor = 'ew-resize';
    } else if (direction === 'top' || direction === 'bottom') {
      document.body.style.cursor = 'ns-resize';
    }

    e.stopPropagation();
    e.preventDefault();
  }

  protected onResizeStartTouch(panel: 'tree' | 'props', direction: 'corner' | 'left' | 'right' | 'top' | 'bottom', e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.isResizing = true;
    this.activeResizePanel = panel;
    this.resizeDirection = direction;
    this.resizeStartX = touch.clientX;
    this.resizeStartY = touch.clientY;
    this.resizeOriginW = panel === 'tree' ? this.panelW() : this.propPanelW();
    this.resizeOriginH = panel === 'tree' ? this.panelH() : this.propPanelH();
    this.resizeOriginX = panel === 'tree' ? this.panelX() : this.propPanelX();
    this.resizeOriginY = panel === 'tree' ? this.panelY() : this.propPanelY();
    document.body.style.userSelect = 'none';
    e.stopPropagation();
    e.preventDefault();
  }

  protected togglePanelVisible(): void {
    this.treePanelVisible.set(!this.treePanelVisible());
  }

  protected toggleBackground(): void {
    const isDark = !this.darkBackground();
    this.darkBackground.set(isDark);
    if (this.world) {
      this.world.scene.three.background = new THREE.Color(isDark ? '#1a2634' : '#dce8f7');
    }
  }

  protected togglePropPanelVisible(): void {
    this.propPanelVisible.set(!this.propPanelVisible());
  }

  protected togglePropPanelMinimized(): void {
    this.propPanelMinimized.set(!this.propPanelMinimized());
  }

  protected togglePropertyGroup(group: IfcPropertyGroup): void {
    group.isExpanded = !group.isExpanded;
    this.propertyGroups.set([...this.propertyGroups()]);
  }

  constructor(private readonly notificationService: PoNotificationService) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    }
    await this.initViewer();
    await this.loadDefaultModel();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
    if (this.hoverRafId !== null) {
      cancelAnimationFrame(this.hoverRafId);
      this.hoverRafId = null;
    }
    this.destroyViewer();
  }

  private destroyViewer(): void {
    if (this.viewerCanvas) {
      this.viewerCanvas.removeEventListener('mousemove', this.onViewerMouseMove);
      this.viewerCanvas.removeEventListener('mouseleave', this.onViewerMouseLeave);
      this.viewerCanvas.removeEventListener('dblclick', this.onViewerClick);
      this.viewerCanvas = null;
    }
    this.hoveredLocalId = null;
    this.localIdToNode.clear();
    this.components?.dispose();
    this.components = null;
    this.world = null;
    this.fragments = null;
    this.ifcLoader = null;
    this.currentLoadedModel = null;
    this.selectedFragments.clear();
    this.selectedLocalIds = [];
    this.selectedNodeId = null;
    this.rootNodes = [];
    this.nodeCounter = 0;
    this.treeNodes.set([]);
    this.filteredTreeNodes.set([]);
    this.searchText.set('');
    this.propertyGroups.set([]);
    this.selectedObjectName.set('');
    this.propPanelVisible.set(false);

    const containerEl = this.containerRef()?.nativeElement;
    if (containerEl) {
      containerEl.innerHTML = '';
    }
  }

  // ── Tree helpers ─────────────────────────────────────────────────────────

  private static readonly IFC_PT: Record<string, string> = {
    // ── Estrutura Espacial ───────────────────────────────────────────
    IFCPROJECT: 'Projeto',
    IFCSITE: 'Terreno',
    IFCBUILDING: 'Construção',
    IFCBUILDINGSTOREY: 'Pavimento',
    IFCSPACE: 'Espaço',
    IFCZONE: 'Zona',
    IFCSPATIALELEMENT: 'Elemento Espacial',
    IFCSPATIALSTRUCTUREELEMENT: 'Estrutura Espacial',
    IFCSPATIALZONE: 'Zona Espacial',
    IFCEXTERNALSPATIALELEMENT: 'Elemento Espacial Externo',
    IFCFACILITY: 'Instalação',
    IFCFACILITYPART: 'Parte da Instalação',
    IFCFACILITYPARTCOMMON: 'Parte Comum da Instalação',
    IFCBRIDGE: 'Ponte',
    IFCBRIDGEPART: 'Parte de Ponte',
    IFCROAD: 'Rodovia',
    IFCROADPART: 'Parte de Rodovia',
    IFCMARINESTRUCTURE: 'Estrutura Marítima',
    IFCMARINEFACILITY: 'Instalação Marítima',
    IFCMARINEFACILITYPART: 'Parte de Instalação Marítima',
    IFCRAILWAY: 'Ferrovia',
    IFCRAILWAYPART: 'Parte de Ferrovia',

    // ── Elementos de Construção ──────────────────────────────────────
    IFCWALL: 'Parede',
    IFCWALLSTANDARDCASE: 'Parede',
    IFCWALLELEMENTEDCASE: 'Parede Composta',
    IFCSLAB: 'Laje',
    IFCSLABSTANDARDCASE: 'Laje',
    IFCSLABELEMENTEDCASE: 'Laje Composta',
    IFCCOLUMN: 'Coluna',
    IFCCOLUMNSTANDARDCASE: 'Coluna',
    IFCBEAM: 'Viga',
    IFCBEAMSTANDARDCASE: 'Viga',
    IFCDOOR: 'Porta',
    IFCDOORSTANDARDCASE: 'Porta',
    IFCWINDOW: 'Janela',
    IFCWINDOWSTANDARDCASE: 'Janela',
    IFCSTAIR: 'Escada',
    IFCSTAIRSTEP: 'Degrau',
    IFCSTAIRFLIGHT: 'Lanço de Escada',
    IFCRAMP: 'Rampa',
    IFCRAMPFLIGHT: 'Lanço de Rampa',
    IFCROOF: 'Cobertura',
    IFCPLATE: 'Placa',
    IFCPLATESTANDARDCASE: 'Placa',
    IFCMEMBER: 'Estrutura',
    IFCMEMBERSTANDARDCASE: 'Estrutura',
    IFCMEMBERFASTENINGCASE: 'Conector Estrutural',
    IFCFOOTING: 'Fundação',
    IFCPILE: 'Estaca',
    IFCCURTAINWALL: 'Fachada Envidraçada',
    IFCCOVERING: 'Revestimento',
    IFCRAILING: 'Guarda-corpo',
    IFCHANDRAIL: 'Corrimão',
    IFCCHIMNEY: 'Chaminé',
    IFCSHADINGDEVICE: 'Proteção Solar',
    IFCSURFACEFEATURE: 'Feição de Superfície',
    IFCWINDOWPANEL: 'Folha de Janela',
    IFCDOORPANEL: 'Folha de Porta',
    IFCBUILDINGELEMENTPART: 'Parte de Elemento',
    IFCBUILDINGELEMENTPROXY: 'Elemento Genérico',
    IFCBUILDINGELEMENTCOMPONENT: 'Componente Construtivo',
    IFCOPENINGELEMENT: 'Abertura',
    IFCVIRTUALELEMENT: 'Elemento Virtual',

    // ── Armadura e Conectores ────────────────────────────────────────
    IFCREINFORCINGBAR: 'Barra de Armadura',
    IFCREINFORCINGMESH: 'Malha de Armadura',
    IFCREINFORCINGELEMENT: 'Elemento de Armadura',
    IFCTENDON: 'Tendão',
    IFCTENDONANCHOR: 'Ancoragem de Tendão',
    IFCTENDONTYPE: 'Tipo de Tendão',
    IFCFASTENER: 'Conector',
    IFCMECHANICALFASTENER: 'Fixador Mecânico',
    IFCDISCRETEACCESSORY: 'Acessório',

    // ── Mobiliário e Equipamentos ────────────────────────────────────
    IFCFURNISHINGELEMENT: 'Mobiliário',
    IFCFURNITURE: 'Mobiliário',
    IFCSYSTEMFURNITUREELEMENT: 'Mobiliário de Sistema',
    IFCELECTRICAPPLIANCE: 'Eletrodoméstico',

    // ── Transporte ───────────────────────────────────────────────────
    IFCTRANSPORTELEMENT: 'Equipamento de Transporte',
    IFCELEVATOR: 'Elevador',
    IFCESCALATOR: 'Escada Rolante',
    IFCMOVINGWALKWAY: 'Esteira',
    IFCTRANSPORTATIONDEVICE: 'Dispositivo de Transporte',
    IFCVEHICLE: 'Veículo',

    // ── Infraestrutura Civil ─────────────────────────────────────────
    IFCPAVEMENT: 'Pavimentação',
    IFCKERB: 'Meio-fio',
    IFCRAIL: 'Trilho',
    IFCTRACK: 'Via Férrea',
    IFCALIGNMENT: 'Alinhamento',
    IFCALIGNMENTHORIZONTAL: 'Alinhamento Horizontal',
    IFCALIGNMENTVERTICAL: 'Alinhamento Vertical',
    IFCALIGNMENTCANT: 'Superelevação',
    IFCALIGNMENTSEGMENT: 'Segmento de Alinhamento',
    IFCEARTHWORKS: 'Terraplenagem',
    IFCEARTHWORKSFILL: 'Aterro',
    IFCEARTHWORKSCUT: 'Corte de Terra',
    IFCEMBANKMENT: 'Talude',
    IFCSOLIDSTRATUM: 'Estrato Sólido',
    IFCVOIDSTRATUM: 'Estrato Vazio',
    IFCGEOMODEL: 'Modelo Geológico',
    IFCGEOSLICE: 'Fatia Geológica',
    IFCGEOTECHNICALASSEMBLY: 'Conjunto Geotécnico',
    IFCGEOTECHNICALELEMENT: 'Elemento Geotécnico',
    IFCBOREHOLEELEMENT: 'Sondagem',
    IFCSOILELEMENT: 'Elemento de Solo',

    // ── Distribuição – Geral ─────────────────────────────────────────
    IFCDUCT: 'Duto',
    IFCDUCTFITTING: 'Conexão de Duto',
    IFCDUCTSEGMENT: 'Segmento de Duto',
    IFCDUCTSILENCER: 'Silencioso de Duto',
    IFCPIPE: 'Tubulação',
    IFCPIPEFITTING: 'Conexão de Tubulação',
    IFCPIPESEGMENT: 'Segmento de Tubulação',
    IFCCABLECARRIERSEGMENT: 'Eletrocalha',
    IFCCABLECARRIERFITTING: 'Conexão de Eletrocalha',
    IFCCABLESEGMENT: 'Cabo',
    IFCCABLEFITTING: 'Conexão de Cabo',
    IFCDISTRIBUTIONCHAMBER: 'Câmara de Distribuição',
    IFCDISTRIBUTIONCIRCUIT: 'Circuito de Distribuição',
    IFCDISTRIBUTIONSYSTEM: 'Sistema de Distribuição',
    IFCDISTRIBUTIONFLOWSEGMENT: 'Segmento de Fluxo',
    IFCFLOWSEGMENT: 'Segmento de Fluxo',
    IFCFLOWFITTING: 'Conexão de Fluxo',

    // ── HVAC ─────────────────────────────────────────────────────────
    IFCAIRTERMINAL: 'Terminal de Ar',
    IFCAIRTERMINALBOX: 'Caixa de Terminal de Ar',
    IFCAIRTOAIRHEATRECOVERY: 'Recuperador de Calor',
    IFCBOILER: 'Caldeira',
    IFCBURNER: 'Queimador',
    IFCCHILLER: 'Resfriador',
    IFCCOIL: 'Serpentina',
    IFCCOMPRESSOR: 'Compressor',
    IFCCONDENSER: 'Condensador',
    IFCCOOLEDBEAM: 'Viga Fria',
    IFCCOOLINGTOWER: 'Torre de Resfriamento',
    IFCEVAPORATIVECOOLER: 'Resfriador Evaporativo',
    IFCEVAPORATOR: 'Evaporador',
    IFCENGINE: 'Motor',
    IFCFAN: 'Ventilador',
    IFCFILTER: 'Filtro',
    IFCHEATEXCHANGER: 'Trocador de Calor',
    IFCHUMIDIFIER: 'Umidificador',
    IFCPUMP: 'Bomba',
    IFCSPACEHEATER: 'Aquecedor de Ambiente',
    IFCTANK: 'Tanque',
    IFCTUBEBUNDLE: 'Feixe de Tubos',
    IFCUNITARYCONTROLELEMENT: 'Controle Unitário',
    IFCUNITARYEQUIPMENT: 'Equipamento Unitário',
    IFCVALVE: 'Válvula',
    IFCVIBRATIONISOLATOR: 'Isolador de Vibração',
    IFCVIBRATIONDAMPER: 'Amortecedor de Vibração',
    IFCFLUIDDRIVENAPPLIANCE: 'Equipamento Hidráulico',

    // ── Elétrica ─────────────────────────────────────────────────────
    IFCELECTRICDISTRIBUTIONBOARD: 'Quadro de Distribuição',
    IFCELECTRICFLOWSTORAGEDEVICE: 'Bateria',
    IFCELECTRICFLOWTREATMENTDEVICE: 'Tratamento Elétrico',
    IFCELECTRICGENERATOR: 'Gerador',
    IFCELECTRICMOTOR: 'Motor Elétrico',
    IFCELECTRICTIMECONTROL: 'Temporizador',
    IFCLAMP: 'Braçadeira',
    IFCLIGHTFIXTURE: 'Luminária',
    IFCOUTLET: 'Tomada/Ponto Elétrico',
    IFCJUNCTIONBOX: 'Caixa de Passagem',
    IFCMOTORCONNECTION: 'Conexão de Motor',
    IFCPROTECTIVEDEVICE: 'Dispositivo de Proteção',
    IFCPROTECTIVEDEVICETRIPPINGUNIT: 'Unidade de Disparo',
    IFCSOLARDEVICE: 'Dispositivo Solar',
    IFCSWITCHINGDEVICE: 'Dispositivo de Chaveamento',
    IFCTRANSFORMER: 'Transformador',
    IFCELECTRICDISTRIBUTIONELEMENT: 'Distribuição Elétrica',

    // ── Automação e Controle ─────────────────────────────────────────
    IFCSENSOR: 'Sensor',
    IFCACTUATOR: 'Atuador',
    IFCALARM: 'Alarme',
    IFCCOMMUNICATIONSAPPLIANCE: 'Equipamento de Comunicação',
    IFCCONTROLLER: 'Controlador',
    IFCFIRESUPRESSIONTERMINAL: 'Terminal de Supressão de Incêndio',
    IFCFIRESUPPRESSIONTERMINAL: 'Terminal de Supressão de Incêndio',
    IFCAUDIOVISUALAPPLIANCE: 'Equipamento Audiovisual',

    // ── Hidráulico / Sanitário ────────────────────────────────────────
    IFCSANITARYTERMINAL: 'Ponto Sanitário',
    IFCWASTETERMINAL: 'Ralo/Coletor',
    IFCSTACKTERMINAL: 'Terminal de Coluna',
    IFCFLOWTERMINAL: 'Terminal de Fluxo',
    IFCFLOWMOVINGDEVICE: 'Dispositivo de Movimentação de Fluido',
    IFCINTERCEPTOR: 'Separador',
    IFCFLOWMETER: 'Medidor de Vazão',
    IFCMEDICALDEVICE: 'Equipamento Médico',

    // ── Geográfico e Anotações ───────────────────────────────────────
    IFCGEOGRAPHICELEMENT: 'Elemento Geográfico',
    IFCANNOTATION: 'Anotação',
    IFCGRID: 'Malha de Eixos',

    // ── Análise Estrutural ───────────────────────────────────────────
    IFCSTRUCTURALANALYSISMODEL: 'Modelo Analítico',
    IFCSTRUCTURALCURVEACTION: 'Ação em Curva',
    IFCSTRUCTURALCURVEMEMBER: 'Membro em Curva',
    IFCSTRUCTURALCURVEMEMBERVARYING: 'Membro Variável em Curva',
    IFCSTRUCTURALCURVEREACTION: 'Reação em Curva',
    IFCSTRUCTURALEDGECONNECTION: 'Ligação de Borda',
    IFCSTRUCTURALFACESURFACE: 'Superfície Estrutural',
    IFCSTRUCTURALPOINTACTION: 'Ação em Ponto',
    IFCSTRUCTURALPOINTCONNECTION: 'Ligação em Ponto',
    IFCSTRUCTURALPOINTREACTION: 'Reação em Ponto',
    IFCSTRUCTURALSURFACEACTION: 'Ação em Superfície',
    IFCSTRUCTURALSURFACEMEMBER: 'Membro em Superfície',
    IFCSTRUCTURALSURFACEMEMBERVARYING: 'Membro Variável em Superfície',
    IFCSTRUCTURALSURFACEREACTION: 'Reação em Superfície',

    // ── Processos / Obras ────────────────────────────────────────────
    IFCTASK: 'Tarefa',
    IFCPROCEDURE: 'Procedimento',
    IFCEVENT: 'Evento',
    IFCWORKPLAN: 'Plano de Trabalho',
    IFCWORKSCHEDULE: 'Cronograma',

    // ── Recursos ─────────────────────────────────────────────────────
    IFCLABORRESOURCE: 'Mão de Obra',
    IFCCONSTRUCTIONEQUIPMENTRESOURCE: 'Equipamento de Obra',
    IFCCONSTRUCTIONMATERIALRESOURCE: 'Material de Obra',
    IFCCONSTRUCTIONPRODUCTRESOURCE: 'Produto de Obra',
    IFCSUBCONTRACTRESOURCE: 'Subcontratação',
    IFCCREWRESOURCE: 'Equipe',

    // ── Grupos e Sistemas ────────────────────────────────────────────
    IFCGROUP: 'Grupo',
    IFCASSET: 'Ativo',
    IFCINVENTORY: 'Inventário',
    IFCSYSTEM: 'Sistema',
    IFCBUILDINGSYSTEM: 'Sistema Predial',
  };

  private translateCategory(raw: string | null): string {
    if (!raw) return 'Item';
    return IfcViewer.IFC_PT[raw.toUpperCase()] ?? this.toTitleCase(raw);
  }

  private toTitleCase(s: string): string {
    return s.replace(/^IFC/i, '').replace(/([A-Z])/g, ' $1').trim();
  }

  /** Constrói os filhos de um nó, achatando nós agrupadores (sem localId) para que
   *  os elementos reais apareçam diretamente no nível do pai. */
  private buildChildren(items: SpatialNode[], level: number, parentCategory?: string): IfcNode[] {
    const result: IfcNode[] = [];
    for (const item of items) {
      if (item.localId === null) {
        // Nó sem localId → é um agrupador (de tipo ou de estrutura), promove os filhos ao nível atual
        const catToPass = item.category ?? parentCategory;
        result.push(...this.buildChildren(item.children ?? [], level, catToPass));
      } else {
        // Nó com localId → é um elemento real do IFC
        const node = this.buildTreeNode(item, level, parentCategory);
        result.push(node);
      }
    }
    return result;
  }

  private buildTreeNode(item: SpatialNode, level: number, parentCategory?: string): IfcNode {
    const id = `n${this.nodeCounter++}`;
    // Se não tem categoria, herda do pai. Se ainda não tiver, usa Item.
    const effectiveCategory = item.category ?? parentCategory ?? null;
    const label = this.translateCategory(effectiveCategory);
    const children = this.buildChildren(item.children ?? [], level + 1, effectiveCategory ?? undefined);
    
    // Use the localId from the first child if this node doesn't have one
    // This helps us retrieve the name attributes for container elements like IFCSITE, IFCBUILDING
    let localIdForAttrs = item.localId;
    if (!localIdForAttrs && item.children && item.children.length > 0) {
      const firstChild = item.children[0];
      if (firstChild.localId !== null) {
        localIdForAttrs = firstChild.localId;
      }
    }
    
    // Determina se o nó deve iniciar expandido
    // Expande níveis iniciais (até 3) E elementos estruturais como BUILDING, BUILDINGSTOREY
    const structuralElements = ['IFCBUILDING', 'IFCBUILDINGSTOREY', 'IFCSITE', 'IFCPROJECT'];
    const isStructural = effectiveCategory ? structuralElements.includes(effectiveCategory.toUpperCase()) : false;
    const shouldExpand = level < 3 || isStructural;
    
    const node: IfcNode = {
      id,
      localId: localIdForAttrs,
      category: label,
      name: label,
      level,
      hasChildren: children.length > 0,
      isExpanded: shouldExpand,
      children,
    };
    return node;
  }

  private getAllNodes(nodes: IfcNode[]): IfcNode[] {
    const result: IfcNode[] = [];
    const visit = (n: IfcNode) => { result.push(n); n.children.forEach(visit); };
    nodes.forEach(visit);
    return result;
  }

  private updateFlatList(): void {
    const flat: IfcNode[] = [];
    const visit = (node: IfcNode) => {
      flat.push(node);
      if (node.isExpanded && node.hasChildren) {
        node.children.forEach(visit);
      }
    };
    this.rootNodes.forEach(visit);
    this.treeNodes.set([...flat]);
    this.filterNodes();
  }

  protected onSearchChange(text: string): void {
    this.searchText.set(text);
    if (text.trim()) {
      this.expandAll();
    }
    this.filterNodes();
  }

  private filterNodes(): void {
    const search = this.searchText().toLowerCase().trim();
    if (!search) {
      this.filteredTreeNodes.set(this.treeNodes());
      return;
    }

    const filtered = this.treeNodes().filter(node => {
      const name = node.name.toLowerCase();
      const category = node.category.toLowerCase();
      return name.includes(search) || category.includes(search);
    });

    this.filteredTreeNodes.set(filtered);
  }

  protected onNodeClick(node: IfcNode): void {
    this.selectedNodeId = node.id;
    if (node.hasChildren) {
      node.isExpanded = !node.isExpanded;
      this.updateFlatList();
    }
    this.highlightNodeInModel(node);
    if (node.localId !== null) {
      this.loadProperties(node.localId, node.name);
    }
  }

  protected zoomToNode(node: IfcNode): void {
    this.selectedNodeId = node.id;
    this.highlightNodeInModel(node, true);
  }

  protected isNodeSelected(node: IfcNode): boolean {
    return this.selectedNodeId === node.id;
  }

  private async highlightNodeInModel(node: IfcNode, zoomTo = false): Promise<void> {
    if (!this.currentLoadedModel) return;

    const model = this.currentLoadedModel;

    try {
      // Reset highlight dos itens anteriores
      if (this.selectedLocalIds.length > 0) {
        await model.resetHighlight(this.selectedLocalIds);
        await model.resetOpacity(undefined);
        this.fragments?.core.update(true);
      }

      // Coleta todos os localIds do nó e seus descendentes
      const localIds = this.collectLocalIds(node);
      if (localIds.length === 0) return;

      this.selectedLocalIds = localIds;

      // Aplica highlight azul escuro com depthTest=false para sobrepor demais elementos
      const highlightMaterial: FRAGS.MaterialDefinition = {
        color: new THREE.Color(0x003eb3),
        opacity: 1,
        transparent: false,
        renderedFaces: FRAGS.RenderedFaces.TWO,
        depthTest: false,
      };
      await model.highlight(localIds, highlightMaterial);

      // Força o re-render do modelo após o highlight
      this.fragments?.core.update(true);

      // Faz zoom apenas no duplo clique
      if (zoomTo && this.world) {
        const box = await model.getMergedBox(localIds);
        if (box && !box.isEmpty()) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);

          const helperMesh = new THREE.Mesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial(),
          );
          helperMesh.position.copy(center);
          this.world.scene.three.add(helperMesh);

          await this.world.camera.controls.fitToBox(helperMesh, true, {
            paddingLeft: maxDim * 0.3,
            paddingRight: maxDim * 0.3,
            paddingTop: maxDim * 0.3,
            paddingBottom: maxDim * 0.3,
          });

          this.world.scene.three.remove(helperMesh);
          helperMesh.geometry.dispose();
          (helperMesh.material as THREE.Material).dispose();
        }
      }
    } catch (e) {
      console.warn('Aviso ao selecionar objeto no modelo:', e);
    }
  }

  private collectLocalIds(node: IfcNode): number[] {
    const ids: number[] = [];
    const collect = (n: IfcNode) => {
      if (n.localId !== null) ids.push(n.localId);
      n.children.forEach(collect);
    };
    collect(node);
    return ids;
  }

  protected expandAll(): void {
    const expandNodeRecursive = (node: IfcNode) => {
      if (node.hasChildren) {
        node.isExpanded = true;
        node.children.forEach(expandNodeRecursive);
      }
    };
    this.rootNodes.forEach(expandNodeRecursive);
    this.updateFlatList();
  }

  protected collapseAll(): void {
    const collapseNodeRecursive = (node: IfcNode) => {
      if (node.hasChildren) {
        node.isExpanded = false;
        node.children.forEach(collapseNodeRecursive);
      }
    };
    this.rootNodes.forEach(collapseNodeRecursive);
    this.updateFlatList();
  }

  protected trackByNodeId(_: number, node: IfcNode): string {
    return node.id;
  }

  /** Expande todos os ancestrais de um nó para que ele fique visível na lista plana. */
  private expandToNode(target: IfcNode): void {
    const findPath = (nodes: IfcNode[], path: IfcNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === target.id) return true;
        if (node.hasChildren) {
          path.push(node);
          if (findPath(node.children, path)) return true;
          path.pop();
        }
      }
      return false;
    };
    const path: IfcNode[] = [];
    findPath(this.rootNodes, path);
    for (const ancestor of path) {
      ancestor.isExpanded = true;
    }
    this.updateFlatList();
  }

  private async buildTree(model: ReturnType<OBC.FragmentsManager['list']['get']>): Promise<void> {
    if (!model) return;
    this.currentLoadedModel = model;
    this.isTreeLoading.set(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spatial: SpatialNode = await (model as any).getSpatialStructure();
      
      this.nodeCounter = 0;
      const root = this.buildTreeNode(spatial, 0);
      // Se a raiz é um IFCPROJECT, usa seus filhos como raízes diretas para evitar duplicação
      if (root.children.length > 0 && root.category === this.translateCategory('IFCPROJECT')) {
        this.rootNodes = root.children;
      } else {
        this.rootNodes = [root];
      }
      this.updateFlatList();

      // Load Name attribute for nodes that have valid localIds
      const allNodes = this.getAllNodes(this.rootNodes);
      const validNodes = allNodes.filter(n => n.localId !== null);
      const ids = validNodes.map(n => n.localId as number);

      if (ids.length > 0) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const itemsData: any[] = await (model as any).getItemsData(ids, {
            attributesDefault: true,
            relationsDefault: false,
          });

          validNodes.forEach((node, i) => {
            const data = itemsData[i];
            if (data && data['Name']) {
              // The Name attribute might be a string or an object with a 'value' property
              let nameValue = data['Name'];
              if (typeof nameValue === 'object' && nameValue !== null && 'value' in nameValue) {
                nameValue = (nameValue as any).value;
              }
              const val = nameValue ? String(nameValue).trim() : null;
              node.name = val ? `${node.category}: ${val}` : node.category;
            }
          });
        } catch (e) {
          console.warn('Aviso ao carregar nomes dos items:', e);
          // Continue without names if there's an error
        }
      }

      this.updateFlatList();

      // Reconstrói o mapa localId → IfcNode com os nomes já carregados
      this.localIdToNode.clear();
      for (const node of this.getAllNodes(this.rootNodes)) {
        if (node.localId !== null) {
          this.localIdToNode.set(node.localId, node);
        }
      }

      this.cdr.detectChanges();
    } catch (e) {
      console.error('Erro ao construir árvore IFC:', e);
    } finally {
      this.isTreeLoading.set(false);
    }
  }

  // ── Viewer init ──────────────────────────────────────────────────────────

  private async initViewer(): Promise<void> {
    const containerEl = this.containerRef()?.nativeElement;
    if (!containerEl) return;

    this.components = new OBC.Components();
    const worlds = this.components.get(OBC.Worlds);

    this.world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBC.SimpleRenderer
    >();

    this.world.scene = new OBC.SimpleScene(this.components);
    this.world.scene.setup();
    this.world.scene.three.background = new THREE.Color('#1a2634');

    this.world.renderer = new OBC.SimpleRenderer(this.components, containerEl);
    this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);

    this.components.init();
    this.components.get(OBC.Grids).create(this.world);

    // Registra listeners de interação no canvas do renderer
    this.viewerCanvas = this.world.renderer.three.domElement;
    this.viewerCanvas.addEventListener('mousemove', this.onViewerMouseMove);
    this.viewerCanvas.addEventListener('mouseleave', this.onViewerMouseLeave);
    this.viewerCanvas.addEventListener('dblclick', this.onViewerClick);

    // Configura o IfcLoader
    this.ifcLoader = this.components.get(OBC.IfcLoader);
    await this.ifcLoader.setup({
      autoSetWasm: false,
      wasm: {
        path: document.baseURI,
        absolute: true,
      },
    });

    // Configura o FragmentsManager
    const workerUrl = await OBC.FragmentsManager.getWorker();
    this.fragments = this.components.get(OBC.FragmentsManager);
    this.fragments.init(workerUrl);

    this.world.camera.controls.addEventListener('update', () =>
      this.fragments?.core.update(),
    );

    // Remove z-fighting
    this.fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
      if (!('isLodMaterial' in material && material.isLodMaterial)) {
        (material as THREE.Material & { polygonOffset: boolean; polygonOffsetUnits: number; polygonOffsetFactor: number }).polygonOffset = true;
        (material as THREE.Material & { polygonOffset: boolean; polygonOffsetUnits: number; polygonOffsetFactor: number }).polygonOffsetUnits = 1;
        (material as THREE.Material & { polygonOffset: boolean; polygonOffsetUnits: number; polygonOffsetFactor: number }).polygonOffsetFactor = Math.random();
      }
    });

    // Adiciona o modelo à cena ao ser carregado
    this.fragments.list.onItemSet.add(({ value: model }) => {
      model.useCamera(this.world!.camera.three);
      this.world!.scene.three.add(model.object);
      this.fragments?.core.update(true);

      // Força atualização das matrizes para bounding box preciso
      this.world!.scene.three.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(model.object);
      if (!box.isEmpty()) {
        // Posiciona a câmera longe (zoom out) e anima suavemente até encaixar o modelo
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        this.world!.camera.three.position.set(
          center.x + maxDim * 4,
          center.y + maxDim * 3,
          center.z + maxDim * 4,
        );
        this.world!.camera.three.lookAt(center);
        this.world!.camera.controls.fitToBox(model.object, true, {
          paddingLeft: 0.1,
          paddingRight: 0.1,
          paddingTop: 0.1,
          paddingBottom: 0.1,
        });
      }
    });
  }

  private async loadDefaultModel(): Promise<void> {
    if (!this.ifcLoader || !this.fragments) return;

    const fileName = 'SampleHouse.ifc';
    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.loadingMessage.set(`Carregando ${fileName}...`);

    try {
      const response = await fetch(`ifc/${fileName}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
      this.loadingProgress.set(10);

      const defaultModel = await this.ifcLoader.load(data, false, fileName.replace('.ifc', ''), {
        processData: {
          progressCallback: (progress: number) => {
            this.loadingProgress.set(10 + Math.round(progress * 90));
            this.loadingMessage.set(`Convertendo modelo: ${Math.round(progress * 100)}%`);
          },
        },
      });

      this.loadingProgress.set(100);
      this.modelLoaded.set(true);
      this.loadedFileName.set(fileName);
      await this.hideIfcSpaces(defaultModel);
      this.buildTree(defaultModel);
    } catch (error) {
      this.notificationService.error({ message: 'Erro ao carregar o modelo padrão.' });
      console.error('Erro ao carregar modelo padrão:', error);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set('');
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ifc')) {
      this.notificationService.error({ message: 'Por favor, selecione um arquivo IFC válido.' });
      return;
    }

    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.loadingMessage.set(`Reiniciando visualizador...`);
    this.modelLoaded.set(false);
    this.loadedFileName.set('');

    try {
      // Reinicia o visualizador completamente antes de carregar o novo arquivo
      this.destroyViewer();
      await this.initViewer();

      this.loadingMessage.set(`Carregando ${file.name}...`);

      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      this.loadingProgress.set(10);

      const fileModel = await this.ifcLoader!.load(data, false, file.name.replace('.ifc', ''), {
        processData: {
          progressCallback: (progress: number) => {
            this.loadingProgress.set(10 + Math.round(progress * 90));
            this.loadingMessage.set(`Convertendo modelo: ${Math.round(progress * 100)}%`);
          },
        },
      });

      this.loadingProgress.set(100);
      this.modelLoaded.set(true);
      this.loadedFileName.set(file.name);
      await this.hideIfcSpaces(fileModel);
      this.buildTree(fileModel);
      this.notificationService.success({ message: `Arquivo "${file.name}" carregado com sucesso!` });
    } catch (error) {
      this.notificationService.error({ message: 'Erro ao carregar o arquivo IFC. Verifique se o arquivo é válido.' });
      console.error('Erro ao carregar IFC:', error);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set('');
      // Reset input para permitir recarregar o mesmo arquivo
      input.value = '';
    }
  }

  protected triggerFileInput(): void {
    const input = document.getElementById('ifc-file-input') as HTMLInputElement;
    input?.click();
  }

  async loadFromUrl(url: string, fileName: string): Promise<void> {
    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.loadingMessage.set(`Reiniciando visualizador...`);
    this.modelLoaded.set(false);
    this.loadedFileName.set('');

    try {
      this.destroyViewer();
      await this.initViewer();

      this.loadingMessage.set(`Baixando ${fileName}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Falha ao baixar arquivo: ${response.status} ${response.statusText}`);
      }
      this.loadingProgress.set(10);

      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
      this.loadingProgress.set(20);

      const modelName = fileName.replace('.ifc', '');
      const fileModel = await this.ifcLoader!.load(data, false, modelName, {
        processData: {
          progressCallback: (progress: number) => {
            this.loadingProgress.set(20 + Math.round(progress * 80));
            this.loadingMessage.set(`Convertendo modelo: ${Math.round(progress * 100)}%`);
          },
        },
      });

      this.loadingProgress.set(100);
      this.modelLoaded.set(true);
      this.loadedFileName.set(fileName);
      await this.hideIfcSpaces(fileModel);
      this.buildTree(fileModel);
      this.notificationService.success({ message: `Arquivo "${fileName}" carregado com sucesso!` });
    } catch (error) {
      this.notificationService.error({ message: 'Erro ao carregar o arquivo IFC a partir da URL.' });
      console.error('Erro ao carregar IFC da URL:', error);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set('');
    }
  }

  private async hideIfcSpaces(model: ReturnType<OBC.FragmentsManager['list']['get']>): Promise<void> {
    if (!model) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const byCategory = await (model as any).getItemsOfCategories([/IFCSPACE/i]) as Record<string, number[]>;
      const ids = Object.values(byCategory).flat();
      if (ids.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (model as any).setVisible(ids, false);
        this.fragments?.core.update(true);
      }
    } catch (e) {
      console.warn('Aviso ao ocultar IFCSPACE:', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractPsetProps(pset: Record<string, any>): IfcProperty[] {
    const props: IfcProperty[] = [];

    // HasProperties (IfcPropertySet / IfcPropertySingleValue)
    const hasProp: Record<string, any>[] = pset['HasProperties'] ?? [];
    for (const p of hasProp) {
      const pName = p['Name']?.value ?? p['Name'] ?? '?';
      const pVal  = p['NominalValue']?.value ?? p['Value']?.value ?? p['NominalValue'] ?? p['Value'];
      if (pVal !== undefined && pVal !== null) {
        const unit = this.resolveUnit(p['Unit']);
        props.push({ name: String(pName), value: String(pVal), unit, type: p['NominalValue']?.type ?? p['type'] });
      }
    }

    // Quantities (IfcElementQuantity)
    const qUnit = this.resolveUnit(pset['Unit']);
    const quantities: Record<string, any>[] = pset['Quantities'] ?? [];
    for (const q of quantities) {
      const qName = q['Name']?.value ?? q['Name'] ?? '?';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qEntry = (['LengthValue','AreaValue','VolumeValue','WeightValue','CountValue','TimeValue'] as const)
        .map(k => ({ k, v: (q as any)[k]?.value ?? (q as any)[k] }))
        .find(e => e.v !== undefined && e.v !== null);
      if (qEntry) {
        const unit = this.resolveUnit(q['Unit']) ?? qUnit ?? this.quantityUnit(qEntry.k);
        props.push({ name: String(qName), value: String(qEntry.v), unit, type: q['type'] });
      }
    }

    return props;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resolveUnit(unit: any): string | undefined {
    if (!unit) return undefined;
    // IfcSIUnit: { type: 'IFCSIUNIT', UnitType: {value:...}, Name: {value:...}, Prefix: {value:...} }
    const prefix: string = unit['Prefix']?.value ?? '';
    const name: string   = unit['Name']?.value ?? unit['value'] ?? '';
    if (!name) return undefined;
    const map: Record<string, string> = {
      METRE: 'm', SQUARE_METRE: 'm²', CUBIC_METRE: 'm³',
      KILOGRAM: 'kg', GRAM: 'g',
      SECOND: 's', MINUTE: 'min', HOUR: 'h',
      DEGREE: '°', RADIAN: 'rad',
      PASCAL: 'Pa', NEWTON: 'N', JOULE: 'J', WATT: 'W',
      LUMEN: 'lm', LUX: 'lx', HERTZ: 'Hz', KELVIN: 'K',
      AMPERE: 'A', VOLT: 'V', OHM: 'Ω', FARAD: 'F',
    };
    const prefixMap: Record<string, string> = {
      MILLI: 'm', CENTI: 'c', KILO: 'k', MEGA: 'M', GIGA: 'G',
    };
    const sym = map[name.toUpperCase()] ?? name;
    const pre = prefix ? (prefixMap[prefix.toUpperCase()] ?? prefix) : '';
    return `${pre}${sym}`;
  }

  private quantityUnit(key: string): string | undefined {
    const m: Record<string, string> = {
      LengthValue: 'm', AreaValue: 'm²', VolumeValue: 'm³',
      WeightValue: 'kg', TimeValue: 's',
    };
    return m[key];
  }

  private async loadProperties(localId: number, nodeName: string): Promise<void> {
    if (!this.currentLoadedModel) return;
    this.isPropsLoading.set(true);
    this.propertyGroups.set([]);
    this.selectedObjectName.set(nodeName);
    this.propPanelVisible.set(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model = this.currentLoadedModel as any;
      const [itemData] = await model.getItemsData([localId], {
        attributesDefault: true,
        relations: {
          IsDefinedBy: { attributes: true, relations: true },
          IsTypedBy:   { attributes: true, relations: true },
        },
        relationsDefault: false,
      }) as Record<string, any>[];

      if (!itemData) return;

      const groups: IfcPropertyGroup[] = [];

      // ── Atributos diretos (valores simples) ─────────────────────────
      const mainProps: IfcProperty[] = [];
      for (const [key, val] of Object.entries(itemData)) {
        if (Array.isArray(val)) continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attr = val as { value?: any; type?: string };
        const raw = attr?.value !== undefined ? attr.value : val;
        if (raw === null || raw === undefined) continue;
        mainProps.push({ name: key, value: String(raw), type: attr?.type });
      }
      if (mainProps.length > 0) {
        groups.push({ name: 'Atributos', properties: mainProps, isExpanded: true });
      }

      // ── Property Sets / Quantity Sets (via IsDefinedBy) ─────────────
      // A biblioteca pode retornar a lista como:
      //   [IfcRelDefinesByProperties { RelatingPropertyDefinition: IfcPropertySet }]
      // ou diretamente:
      //   [IfcPropertySet { HasProperties: [...] }]
      const definedBy: Record<string, any>[] = itemData['IsDefinedBy'] ?? [];
      for (const entry of definedBy) {
        // Resolve o PropertySet: pode vir embrulhado em IfcRelDefinesByProperties
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const candidates: Record<string, any>[] = [];

        if (entry['RelatingPropertyDefinition']) {
          candidates.push(entry['RelatingPropertyDefinition']);
        } else if (entry['HasProperties'] || entry['Quantities']) {
          // já é o PropertySet diretamente
          candidates.push(entry);
        }

        for (const pset of candidates) {
          const setName = pset['Name']?.value ?? pset['Name'] ?? pset['LongName']?.value ?? pset['type'] ?? 'PropertySet';
          const props = this.extractPsetProps(pset);
          if (props.length > 0) {
            groups.push({ name: String(setName), properties: props, isExpanded: true });
          }
        }
      }

      // ── Type properties (via IsTypedBy) ──────────────────────────────
      const typedBy: Record<string, any>[] = itemData['IsTypedBy'] ?? [];
      for (const rel of typedBy) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typeDef: Record<string, any> = rel['RelatingType'] ?? rel;
        const typeName = typeDef['Name']?.value ?? typeDef['Name'] ?? typeDef['type'] ?? 'Tipo';
        const typeProps: IfcProperty[] = [];

        for (const [k, v] of Object.entries(typeDef)) {
          if (k === 'type' || k === 'GlobalId' || Array.isArray(v)) continue;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const attr = v as { value?: any; type?: string };
          const raw = attr?.value !== undefined ? attr.value : v;
          if (raw !== null && raw !== undefined) {
            typeProps.push({ name: k, value: String(raw), type: attr?.type });
          }
        }

        if (typeProps.length > 0) {
          groups.push({ name: `Tipo: ${typeName}`, properties: typeProps, isExpanded: false });
        }
      }

      this.propertyGroups.set(groups);

      // Debug: inspecionar estrutura crua no console durante desenvolvimento
      console.debug('[IFC Props] itemData:', itemData);
      console.debug('[IFC Props] grupos gerados:', groups.map(g => `${g.name} (${g.properties.length})`));
    } catch (e) {
      console.warn('Aviso ao carregar propriedades:', e);
    } finally {
      this.isPropsLoading.set(false);
      this.cdr.detectChanges();
    }
  }
}
