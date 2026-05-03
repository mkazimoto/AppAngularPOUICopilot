import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import * as OBC from '@thatopen/components';
import * as THREE from 'three';
import { PoLoadingModule, PoNotificationService, PoPageAction, PoPageModule, PoProgressModule, PoProgressStatus, PoTagModule, PoTagType } from '@po-ui/ng-components';

@Component({
  selector: 'app-ifc-viewer',
  templateUrl: './ifc-viewer.html',
  styleUrls: ['./ifc-viewer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PoPageModule, PoLoadingModule, PoTagModule, PoProgressModule],
})
export class IfcViewer implements OnInit, OnDestroy {
  private containerRef = viewChild<ElementRef<HTMLDivElement>>('viewerContainer');

  protected isLoading = signal(false);
  protected modelLoaded = signal(false);
  protected loadingMessage = signal('');
  protected loadingProgress = signal(0);
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

  constructor(private readonly notificationService: PoNotificationService) {}

  async ngOnInit(): Promise<void> {
    await this.initViewer();
    await this.loadDefaultModel();
  }

  ngOnDestroy(): void {
    this.components?.dispose();
  }

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

    const fileName = 'OTC-Conference Center.ifc';
    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.loadingMessage.set(`Carregando ${fileName}...`);

    try {
      const response = await fetch(`/ifc/${fileName}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
      this.loadingProgress.set(10);

      await this.ifcLoader.load(data, false, fileName.replace('.ifc', ''), {
        processData: {
          progressCallback: (progress: number) => {
            this.loadingProgress.set(10 + Math.round(progress * 90));
            this.loadingMessage.set(`Convertendo modelo: ${Math.round(progress * 100)}%`);
          },
        },
      });

      this.loadingProgress.set(100);
      this.modelLoaded.set(true);
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
    if (!file || !this.ifcLoader || !this.fragments) return;

    if (!file.name.toLowerCase().endsWith('.ifc')) {
      this.notificationService.error({ message: 'Por favor, selecione um arquivo IFC válido.' });
      return;
    }

    this.isLoading.set(true);
    this.loadingProgress.set(0);
    this.loadingMessage.set(`Carregando ${file.name}...`);

    try {
      // Limpa modelos anteriores sem destruir o FragmentsManager
      for (const model of [...this.fragments.list.values()]) {
        this.world?.scene.three.remove(model.object);
        model.dispose();
      }

      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      this.loadingProgress.set(10);

      await this.ifcLoader.load(data, false, file.name.replace('.ifc', ''), {
        processData: {
          progressCallback: (progress: number) => {
            this.loadingProgress.set(10 + Math.round(progress * 90));
            this.loadingMessage.set(`Convertendo modelo: ${Math.round(progress * 100)}%`);
          },
        },
      });

      this.loadingProgress.set(100);
      this.modelLoaded.set(true);
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
