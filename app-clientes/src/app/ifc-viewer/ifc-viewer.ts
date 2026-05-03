import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  viewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as OBC from '@thatopen/components';
import * as THREE from 'three';
import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { PoLoadingModule, PoNotificationService, PoPageAction, PoPageModule, PoProgressModule, PoProgressStatus, PoTagModule, PoTagType } from '@po-ui/ng-components';

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

  protected isLoading = signal(false);
  protected modelLoaded = signal(false);
  protected loadingMessage = signal('');
  protected loadingProgress = signal(0);
  protected loadedFileName = signal('');
  protected treeNodes = signal<IfcNode[]>([]);
  protected isTreeLoading = signal(false);
  protected treePanelVisible = signal(true);

  // Painel flutuante: posição e tamanho
  protected panelX = signal(16);
  protected panelY = signal(16);
  protected panelW = signal(300);
  protected panelH = signal(480);

  protected readonly tagType = PoTagType.Success;
  protected readonly progressStatus = PoProgressStatus.Default;

  protected readonly pageActions: PoPageAction[] = [
    {
      label: 'Abrir arquivo IFC',
      icon: 'an an-upload',
      action: () => this.triggerFileInput(),
    },
  ];

  private components: OBC.Components | null = null;
  private world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer> | null = null;
  private fragments: OBC.FragmentsManager | null = null;
  private ifcLoader: OBC.IfcLoader | null = null;
  private rootNodes: IfcNode[] = [];
  private nodeCounter = 0;

  // Drag state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragOriginX = 0;
  private dragOriginY = 0;

  // Resize state
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeOriginW = 0;
  private resizeOriginH = 0;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.panelX.set(this.dragOriginX + (e.clientX - this.dragStartX));
      this.panelY.set(this.dragOriginY + (e.clientY - this.dragStartY));
    }
    if (this.isResizing) {
      const newW = Math.max(200, this.resizeOriginW + (e.clientX - this.resizeStartX));
      const newH = Math.max(150, this.resizeOriginH + (e.clientY - this.resizeStartY));
      this.panelW.set(newW);
      this.panelH.set(newH);
    }
  };

  private readonly onMouseUp = () => {
    this.isDragging = false;
    this.isResizing = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  protected onDragStart(e: MouseEvent): void {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragOriginX = this.panelX();
    this.dragOriginY = this.panelY();
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  protected onResizeStart(e: MouseEvent): void {
    this.isResizing = true;
    this.resizeStartX = e.clientX;
    this.resizeStartY = e.clientY;
    this.resizeOriginW = this.panelW();
    this.resizeOriginH = this.panelH();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';
    e.stopPropagation();
    e.preventDefault();
  }

  protected togglePanelVisible(): void {
    this.treePanelVisible.set(!this.treePanelVisible());
  }

  constructor(private readonly notificationService: PoNotificationService) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    await this.initViewer();
    await this.loadDefaultModel();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
    this.destroyViewer();
  }

  private destroyViewer(): void {
    this.components?.dispose();
    this.components = null;
    this.world = null;
    this.fragments = null;
    this.ifcLoader = null;
    this.rootNodes = [];
    this.nodeCounter = 0;
    this.treeNodes.set([]);

    const containerEl = this.containerRef()?.nativeElement;
    if (containerEl) {
      containerEl.innerHTML = '';
    }
  }

  // ── Tree helpers ─────────────────────────────────────────────────────────

  private static readonly IFC_PT: Record<string, string> = {
    IFCPROJECT: 'Projeto',
    IFCSITE: 'Terreno',
    IFCBUILDING: 'Construção',
    IFCBUILDINGSTOREY: 'Pavimento',
    IFCSPACE: 'Espaço',
    IFCZONE: 'Zona',
    IFCWALL: 'Parede',
    IFCWALLSTANDARDCASE: 'Parede',
    IFCSLAB: 'Laje',
    IFCCOLUMN: 'Coluna',
    IFCBEAM: 'Viga',
    IFCDOOR: 'Porta',
    IFCWINDOW: 'Janela',
    IFCSTAIR: 'Escada',
    IFCSTAIRSTEP: 'Degrau',
    IFCSTAIRFLIGHT: 'Lanço de Escada',
    IFCRAMP: 'Rampa',
    IFCRAMPFLIGHT: 'Lanço de Rampa',
    IFCROOF: 'Cobertura',
    IFCFURNISHINGELEMENT: 'Mobiliário',
    IFCFURNITURE: 'Mobiliário',
    IFCSYSTEMFURNITUREELEMENT: 'Mobiliário de Sistema',
    IFCPLATE: 'Placa',
    IFCMEMBER: 'Estrutura',
    IFCFOOTING: 'Fundação',
    IFCPILE: 'Estaca',
    IFCCURTAINWALL: 'Fachada Envidraçada',
    IFCCOVERING: 'Revestimento',
    IFCRAILING: 'Guarda-corpo',
    IFCHANDRAIL: 'Corrimão',
    IFCDUCT: 'Duto',
    IFCDUCTFITTING: 'Conexão de Duto',
    IFCDUCTSEGMENT: 'Segmento de Duto',
    IFCPIPE: 'Tubulação',
    IFCPIPEFITTING: 'Conexão de Tubulação',
    IFCPIPESEGMENT: 'Segmento de Tubulação',
    IFCCABLECARRIERSEGMENT: 'Eletrocalha',
    IFCCABLECARRIERFITTING: 'Conexão de Eletrocalha',
    IFCCABLESEGMENT: 'Cabo',
    IFCAIRTERMINAL: 'Terminal de Ar',
    IFCAIRTOAIRHEATRECOVERY: 'Recuperador de Calor',
    IFCBOILER: 'Caldeira',
    IFCCHILLER: 'Resfriador',
    IFCCOIL: 'Serpentina',
    IFCCOMPRESSOR: 'Compressor',
    IFCCONDENSER: 'Condensador',
    IFCFAN: 'Ventilador',
    IFCFILTER: 'Filtro',
    IFCHEATEXCHANGER: 'Trocador de Calor',
    IFCHUMIDIFIER: 'Umidificador',
    IFCPUMP: 'Bomba',
    IFCTANK: 'Tanque',
    IFCVALVE: 'Válvula',
    IFCELECTRICAPPLIANCE: 'Eletrodoméstico',
    IFCELECTRICDISTRIBUTIONBOARD: 'Quadro de Distribuição',
    IFCELECTRICFLOWSTORAGEDEVICE: 'Bateria',
    IFCELECTRICGENERATOR: 'Gerador',
    IFCELECTRICMOTOR: 'Motor Elétrico',
    IFCELECTRICTIMECONTROL: 'Temporizador',
    IFCLAMP: 'Braçadeira',
    IFCLIGHTFIXTURE: 'Luminária',
    IFCOUTLET: 'Tomada/Ponto Elétrico',
    IFCSENSOR: 'Sensor',
    IFCACTUATOR: 'Atuador',
    IFCALARM: 'Alarme',
    IFCCOMMUNICATIONSAPPLIANCE: 'Equipamento de Comunicação',
    IFCCONTROLLER: 'Controlador',
    IFCFIRESUPRESSIONTERMINAL: 'Terminal de Supressão de Incêndio',
    IFCMEDICALDEVICE: 'Equipamento Médico',
    IFCPROTECTIVEDEVICE: 'Dispositivo de Proteção',
    IFCSWITCHINGDEVICE: 'Dispositivo de Chaveamento',
    IFCTRANSFORMER: 'Transformador',
    IFCDISTRIBUTIONCHAMBER: 'Câmara de Distribuição',
    IFCFLOWMETER: 'Medidor de Vazão',
    IFCINTERCEPTOR: 'Separador',
    IFCSANITARYTERMINAL: 'Ponto Sanitário',
    IFCWASTETERMINAL: 'Ralo/Coletor',
    IFCSTACKTERMINAL: 'Terminal de Coluna',
    IFCELECTRICDISTRIBUTIONELEMENT: 'Distribuição Elétrica',
    IFCBUILDINGELEMENTPART: 'Parte de Elemento',
    IFCBUILDINGELEMENTPROXY: 'Elemento Genérico',
    IFCOPENINGELEMENT: 'Abertura',
    IFCVIRTUALELEMENT: 'Elemento Virtual',
    IFCANNOTATION: 'Anotação',
    IFCGRID: 'Malha de Eixos',
    IFCTRANSPORTELEMENT: 'Equipamento de Transporte',
    IFCELEVATOR: 'Elevador',
    IFCESCALATOR: 'Escada Rolante',
    IFCMOVINGWALKWAY: 'Esteira',
    IFCGEOGRAPHICELEMENT: 'Elemento Geográfico',
  };

  private translateCategory(raw: string | null): string {
    if (!raw) return 'Item';
    return IfcViewer.IFC_PT[raw.toUpperCase()] ?? this.toTitleCase(raw);
  }

  private toTitleCase(s: string): string {
    return s.replace(/^IFC/i, '').replace(/([A-Z])/g, ' $1').trim();
  }

  /** Constrói os filhos de um nó, achatando nós sem categoria ("Item") para que
   *  seus filhos apareçam no mesmo nível em que o nó "Item" estaria. */
  private buildChildren(items: SpatialNode[], level: number): IfcNode[] {
    const result: IfcNode[] = [];
    for (const item of items) {
      if (!item.category) {
        // Nó sem categoria → promove os filhos ao nível atual
        result.push(...this.buildChildren(item.children ?? [], level));
      } else {
        result.push(this.buildTreeNode(item, level));
      }
    }
    return result;
  }

  private buildTreeNode(item: SpatialNode, level: number): IfcNode {
    const id = `n${this.nodeCounter++}`;
    const label = this.translateCategory(item.category);
    const children = this.buildChildren(item.children ?? [], level + 1);
    const node: IfcNode = {
      id,
      localId: item.localId,
      category: label,
      name: label,
      level,
      hasChildren: children.length > 0,
      isExpanded: level < 2,
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
  }

  protected toggleNode(node: IfcNode): void {
    node.isExpanded = !node.isExpanded;
    this.updateFlatList();
  }

  protected trackByNodeId(_: number, node: IfcNode): string {
    return node.id;
  }

  private async buildTree(model: ReturnType<OBC.FragmentsManager['list']['get']>): Promise<void> {
    if (!model) return;
    this.isTreeLoading.set(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spatial: SpatialNode = await (model as any).getSpatialStructure();
      this.nodeCounter = 0;
      const root = this.buildTreeNode(spatial, 0);
      this.rootNodes = [root];
      this.updateFlatList();

      // Batch-load Name attribute for all nodes
      const allNodes = this.getAllNodes(this.rootNodes);
      const validNodes = allNodes.filter(n => n.localId !== null);
      const ids = validNodes.map(n => n.localId as number);

      if (ids.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = await (model as any).getItemsData(ids, {
          attributesDefault: false,
          attributes: ['Name'],
          relationsDefault: { attributes: false, relations: false },
        });

        validNodes.forEach((node, i) => {
          const nameAttr = data[i]?.['Name'];
          const val = nameAttr?.value != null ? String(nameAttr.value).trim() : null;
          node.name = val ? `${node.category}: ${val}` : node.category;
        });

        this.updateFlatList();
        this.cdr.detectChanges();
      }
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

    // Configura o IfcLoader
    this.ifcLoader = this.components.get(OBC.IfcLoader);
    await this.ifcLoader.setup({
      autoSetWasm: false,
      wasm: {
        path: '/',
        absolute: false,
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
}
