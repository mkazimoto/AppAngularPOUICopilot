import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoDividerModule, PoFieldModule, PoPageModule } from '@po-ui/ng-components';

export type ShapeType =
  | 'rectangle'
  | 'roundedRectangle'
  | 'ellipse'
  | 'circle'
  | 'diamond'
  | 'parallelogram'
  | 'text';

export type ConnectionStyle = 'bezier' | 'straight' | 'orthogonal';
export type Tool = 'select' | 'pan' | 'connect';
export type LayoutMode = 'tree' | 'layered' | 'radial';
export type TreeDirection = 'TB' | 'LR';

export interface DiagramNode {
  id: string;
  label: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontColor: string;
  fontSize: number;
  fontBold: boolean;
}

export interface DiagramConnection {
  id: string;
  from: string;
  to: string;
  label: string;
  style: ConnectionStyle;
  color: string;
  strokeWidth: number;
  dashed: boolean;
  arrowStart: boolean;
  arrowEnd: boolean;
}

interface HandleDef {
  id: string;
  cx: number;
  cy: number;
  sx: number;
  sy: number;
}

interface Point {
  x: number;
  y: number;
}

interface DragState {
  mode: 'node' | 'pan' | 'resize';
  nodeId?: string;
  handle?: HandleDef;
  pointerId: number;
  startScreenX: number;
  startScreenY: number;
  startWorldX: number;
  startWorldY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  panX0: number;
  panY0: number;
}

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 3;
const GRID = 20;
const SNAP = 10;

const SHAPE_DEFAULTS: Record<
  ShapeType,
  { w: number; h: number; fill: string; stroke: string; fontSize: number }
> = {
  rectangle: { w: 180, h: 84, fill: '#dbeafe', stroke: '#3b82f6', fontSize: 13 },
  roundedRectangle: { w: 180, h: 84, fill: '#dcfce7', stroke: '#16a34a', fontSize: 13 },
  ellipse: { w: 200, h: 96, fill: '#ede9fe', stroke: '#8b5cf6', fontSize: 13 },
  circle: { w: 110, h: 110, fill: '#fee2e2', stroke: '#ef4444', fontSize: 13 },
  diamond: { w: 180, h: 116, fill: '#fef9c3', stroke: '#ca8a04', fontSize: 13 },
  parallelogram: { w: 210, h: 84, fill: '#cffafe', stroke: '#0891b2', fontSize: 13 },
  text: { w: 160, h: 50, fill: 'transparent', stroke: 'transparent', fontSize: 15 },
};

@Component({
  selector: 'app-diagrama',
  imports: [CommonModule, FormsModule, PoButtonModule, PoDividerModule, PoFieldModule, PoPageModule],
  templateUrl: './diagrama.html',
  styleUrl: './diagrama.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:pointermove)': 'onGlobalPointerMove($event)',
    '(window:pointerup)': 'onGlobalPointerUp($event)',
    '(window:keydown)': 'onGlobalKeyDown($event)',
  },
})
export class Diagrama implements OnInit, AfterViewInit {
  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;

  // ── State (signals) ───────────────────────────────────────────────────
  readonly nodes = signal<DiagramNode[]>([]);
  readonly connections = signal<DiagramConnection[]>([]);
  readonly zoom = signal(1);
  readonly pan = signal({ x: 0, y: 0 });
  readonly tool = signal<Tool>('select');
  readonly layoutMode = signal<LayoutMode>('tree');
  readonly treeDirection = signal<TreeDirection>('TB');
  readonly showGrid = signal(true);
  readonly snapToGrid = signal(true);
  readonly selectedNodeId = signal<string | null>(null);
  readonly selectedConnId = signal<string | null>(null);
  readonly pendingFrom = signal<string | null>(null);
  readonly placingShape = signal<ShapeType | null>(null);
  readonly cursor = signal<Point | null>(null);

  readonly zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);
  readonly hasSelection = computed(() => !!this.selectedNodeId() || !!this.selectedConnId());

  private idCounter = 100;
  private drag: DragState | null = null;

  readonly HANDLES: HandleDef[] = [
    { id: 'nw', cx: 0, cy: 0, sx: -1, sy: -1 },
    { id: 'n', cx: 0.5, cy: 0, sx: 0, sy: -1 },
    { id: 'ne', cx: 1, cy: 0, sx: 1, sy: -1 },
    { id: 'e', cx: 1, cy: 0.5, sx: 1, sy: 0 },
    { id: 'se', cx: 1, cy: 1, sx: 1, sy: 1 },
    { id: 's', cx: 0.5, cy: 1, sx: 0, sy: 1 },
    { id: 'sw', cx: 0, cy: 1, sx: -1, sy: 1 },
    { id: 'w', cx: 0, cy: 0.5, sx: -1, sy: 0 },
  ];

  readonly GRID = 20;

  // ── Options for PO-UI selects ────────────────────────────────────────
  readonly shapeOptions = [
    { label: 'Retângulo', value: 'rectangle' },
    { label: 'Arredondado', value: 'roundedRectangle' },
    { label: 'Elipse', value: 'ellipse' },
    { label: 'Círculo', value: 'circle' },
    { label: 'Diamante', value: 'diamond' },
    { label: 'Paralelogramo', value: 'parallelogram' },
    { label: 'Texto', value: 'text' },
  ];

  readonly paletteItems = [
    { type: 'rectangle' as ShapeType, label: 'Retângulo' },
    { type: 'roundedRectangle' as ShapeType, label: 'Arredondado' },
    { type: 'ellipse' as ShapeType, label: 'Elipse' },
    { type: 'circle' as ShapeType, label: 'Círculo' },
    { type: 'diamond' as ShapeType, label: 'Diamante' },
    { type: 'parallelogram' as ShapeType, label: 'Paralelogramo' },
    { type: 'text' as ShapeType, label: 'Texto' },
  ];

  readonly layoutOptions = [
    { label: 'Árvore', value: 'tree' },
    { label: 'Camadas', value: 'layered' },
    { label: 'Radial', value: 'radial' },
  ];

  readonly connStyleOptions = [
    { label: 'Curva (Bezier)', value: 'bezier' },
    { label: 'Reta', value: 'straight' },
    { label: 'Ortogonal', value: 'orthogonal' },
  ];

  readonly fontSizeOptions = [10, 11, 12, 13, 14, 16, 18, 20, 24].map((n) => ({
    label: `${n}px`,
    value: n,
  }));

  readonly strokeWidthOptions = [0.5, 1, 1.5, 2, 3, 4, 5].map((n) => ({
    label: `${n}px`,
    value: n,
  }));

  readonly markerColors = computed(() => {
    const set = new Set<string>();
    for (const c of this.connections()) set.add(c.color);
    set.add('#3b82f6');
    return [...set];
  });

  // ── Lifecycle ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadSample();
  }

  ngAfterViewInit(): void {
    this.fit();
  }

  // ── Selection helpers ────────────────────────────────────────────────
  selectedNode(): DiagramNode | null {
    const id = this.selectedNodeId();
    return id ? (this.nodes().find((n) => n.id === id) ?? null) : null;
  }

  selectedConnection(): DiagramConnection | null {
    const id = this.selectedConnId();
    return id ? (this.connections().find((c) => c.id === id) ?? null) : null;
  }

  nodeById(id: string): DiagramNode | null {
    return this.nodes().find((n) => n.id === id) ?? null;
  }

  setNodeType(type: string): void {
    const id = this.selectedNodeId();
    if (!id) return;
    const t = type as ShapeType;
    this.nodes.update((arr) => arr.map((n) => (n.id === id ? { ...n, type: t } : n)));
  }

  setConnStyle(style: string): void {
    const id = this.selectedConnId();
    if (!id) return;
    const s = style as ConnectionStyle;
    this.connections.update((arr) => arr.map((c) => (c.id === id ? { ...c, style: s } : c)));
  }

  // ── Node / connection creation ───────────────────────────────────────
  private nextId(prefix: string): string {
    return `${prefix}${this.idCounter++}`;
  }

  private createNode(type: ShapeType, x: number, y: number, label: string): DiagramNode {
    const d = SHAPE_DEFAULTS[type];
    return {
      id: this.nextId('n'),
      label,
      type,
      x,
      y,
      width: d.w,
      height: d.h,
      fill: d.fill,
      stroke: d.stroke,
      strokeWidth: 2,
      fontColor: '#0f172a',
      fontSize: d.fontSize,
      fontBold: false,
    };
  }

  private createConnection(from: string, to: string, label = ''): DiagramConnection {
    return {
      id: this.nextId('c'),
      from,
      to,
      label,
      style: 'bezier',
      color: '#94a3b8',
      strokeWidth: 2,
      dashed: false,
      arrowStart: false,
      arrowEnd: true,
    };
  }

  placeNodeFromPalette(type: ShapeType, x: number, y: number): void {
    const n = this.createNode(type, x - SHAPE_DEFAULTS[type].w / 2, y - SHAPE_DEFAULTS[type].h / 2, this.defaultLabel(type));
    this.nodes.update((arr) => [...arr, n]);
    this.selectedNodeId.set(n.id);
    this.selectedConnId.set(null);
  }

  private defaultLabel(type: ShapeType): string {
    const item = this.paletteItems.find((p) => p.type === type);
    return item ? item.label : 'Novo';
  }

  createConnectionBetween(from: string, to: string): void {
    if (from === to) return;
    const exists = this.connections().some((c) => c.from === from && c.to === to);
    if (exists) return;
    const conn = this.createConnection(from, to);
    this.connections.update((arr) => [...arr, conn]);
    this.selectedConnId.set(conn.id);
    this.selectedNodeId.set(null);
  }

  // ── Tools / palette ──────────────────────────────────────────────────
  setTool(tool: Tool): void {
    this.tool.set(tool);
    this.placingShape.set(null);
    this.pendingFrom.set(null);
  }

  selectPaletteShape(type: ShapeType): void {
    this.placingShape.set(type);
    this.tool.set('select');
    this.pendingFrom.set(null);
  }

  cancelPlace(): void {
    this.placingShape.set(null);
  }

  // ── Canvas pointer events ────────────────────────────────────────────
  onCanvasPointerDown(event: PointerEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      this.startPan(event);
      return;
    }
    const world = this.screenToWorld(event.clientX, event.clientY);
    if (this.placingShape()) {
      this.placeNodeFromPalette(this.placingShape()!, world.x, world.y);
      return;
    }
    if (this.pendingFrom()) {
      this.pendingFrom.set(null);
      return;
    }
    if (this.tool() === 'pan' || event.button === 2) {
      this.startPan(event);
      return;
    }
    this.clearSelection();
  }

  onCanvasPointerMove(event: PointerEvent): void {
    const world = this.screenToWorld(event.clientX, event.clientY);
    this.cursor.set(world);
  }

  onCanvasPointerLeave(): void {
    this.cursor.set(null);
  }

  onNodePointerDown(event: PointerEvent, node: DiagramNode): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === 2) return;
    if (this.placingShape()) {
      const world = this.screenToWorld(event.clientX, event.clientY);
      this.placeNodeFromPalette(this.placingShape()!, world.x, world.y);
      return;
    }
    if (this.tool() === 'connect') {
      if (!this.pendingFrom()) {
        this.pendingFrom.set(node.id);
        this.selectedNodeId.set(node.id);
        this.selectedConnId.set(null);
      } else if (this.pendingFrom() !== node.id) {
        this.createConnectionBetween(this.pendingFrom()!, node.id);
        this.pendingFrom.set(null);
      }
      return;
    }
    this.selectedNodeId.set(node.id);
    this.selectedConnId.set(null);
    this.startNodeDrag(event, node);
  }

  onHandlePointerDown(event: PointerEvent, node: DiagramNode, handle: HandleDef): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedNodeId.set(node.id);
    this.selectedConnId.set(null);
    this.startResize(event, node, handle);
  }

  selectConnection(conn: DiagramConnection, event: Event): void {
    event.stopPropagation();
    this.selectedConnId.set(conn.id);
    this.selectedNodeId.set(null);
    this.pendingFrom.set(null);
    this.placingShape.set(null);
  }

  clearSelection(): void {
    this.selectedNodeId.set(null);
    this.selectedConnId.set(null);
  }

  // ── Drag machinery ───────────────────────────────────────────────────
  private startNodeDrag(event: PointerEvent, node: DiagramNode): void {
    const world = this.screenToWorld(event.clientX, event.clientY);
    this.drag = {
      mode: 'node',
      nodeId: node.id,
      pointerId: event.pointerId,
      startScreenX: event.clientX,
      startScreenY: event.clientY,
      startWorldX: world.x,
      startWorldY: world.y,
      origX: node.x,
      origY: node.y,
      origW: node.width,
      origH: node.height,
      panX0: this.pan().x,
      panY0: this.pan().y,
    };
  }

  private startResize(event: PointerEvent, node: DiagramNode, handle: HandleDef): void {
    const world = this.screenToWorld(event.clientX, event.clientY);
    this.drag = {
      mode: 'resize',
      nodeId: node.id,
      handle,
      pointerId: event.pointerId,
      startScreenX: event.clientX,
      startScreenY: event.clientY,
      startWorldX: world.x,
      startWorldY: world.y,
      origX: node.x,
      origY: node.y,
      origW: node.width,
      origH: node.height,
      panX0: this.pan().x,
      panY0: this.pan().y,
    };
  }

  private startPan(event: PointerEvent): void {
    this.drag = {
      mode: 'pan',
      pointerId: event.pointerId,
      startScreenX: event.clientX,
      startScreenY: event.clientY,
      startWorldX: 0,
      startWorldY: 0,
      origX: 0,
      origY: 0,
      origW: 0,
      origH: 0,
      panX0: this.pan().x,
      panY0: this.pan().y,
    };
    this.clearSelection();
  }

  onGlobalPointerMove(event: PointerEvent): void {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    const d = this.drag;
    if (d.mode === 'pan') {
      this.pan.set({
        x: d.panX0 + (event.clientX - d.startScreenX),
        y: d.panY0 + (event.clientY - d.startScreenY),
      });
      return;
    }
    const world = this.screenToWorld(event.clientX, event.clientY);
    this.cursor.set(world);
    if (d.mode === 'node') {
      const dx = world.x - d.startWorldX;
      const dy = world.y - d.startWorldY;
      let x = d.origX + dx;
      let y = d.origY + dy;
      if (this.snapToGrid()) {
        x = Math.round(x / SNAP) * SNAP;
        y = Math.round(y / SNAP) * SNAP;
      }
      this.nodes.update((arr) => arr.map((n) => (n.id === d.nodeId ? { ...n, x, y } : n)));
    } else if (d.mode === 'resize' && d.handle) {
      this.applyResize(d, world.x, world.y);
    }
  }

  private applyResize(d: DragState, worldX: number, worldY: number): void {
    const h = d.handle!;
    const dx = worldX - d.startWorldX;
    const dy = worldY - d.startWorldY;
    let w = d.origW;
    let hh = d.origH;
    let x = d.origX;
    let y = d.origY;
    if (h.sx !== 0) {
      if (h.sx > 0) w = d.origW + dx;
      else w = d.origW - dx;
      w = Math.max(60, w);
      if (h.sx < 0) x = d.origX + d.origW - w;
    }
    if (h.sy !== 0) {
      if (h.sy > 0) hh = d.origH + dy;
      else hh = d.origH - dy;
      hh = Math.max(40, hh);
      if (h.sy < 0) y = d.origY + d.origH - hh;
    }
    if (this.snapToGrid()) {
      w = Math.round(w / SNAP) * SNAP;
      hh = Math.round(hh / SNAP) * SNAP;
      x = Math.round(x / SNAP) * SNAP;
      y = Math.round(y / SNAP) * SNAP;
    }
    this.nodes.update((arr) =>
      arr.map((n) => (n.id === d.nodeId ? { ...n, x, y, width: Math.max(60, w), height: Math.max(40, hh) } : n)),
    );
  }

  onGlobalPointerUp(event: PointerEvent): void {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    this.drag = null;
  }

  onGlobalKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName ?? '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.deleteSelected();
    } else if (event.key === 'Escape') {
      this.pendingFrom.set(null);
      this.placingShape.set(null);
      this.clearSelection();
    }
  }

  // ── Wheel zoom ───────────────────────────────────────────────────────
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const z = this.zoom();
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z * factor));
    const wx = (px - this.pan().x) / z;
    const wy = (py - this.pan().y) / z;
    this.zoom.set(newZoom);
    this.pan.set({ x: px - wx * newZoom, y: py - wy * newZoom });
  }

  private screenToWorld(clientX: number, clientY: number): Point {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.pan().x) / this.zoom(),
      y: (clientY - rect.top - this.pan().y) / this.zoom(),
    };
  }

  private viewportSize(): { w: number; h: number } {
    const el = this.viewportRef?.nativeElement;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 800, h: 500 };
  }

  // ── View controls ────────────────────────────────────────────────────
  zoomIn(): void {
    const vp = this.viewportSize();
    this.zoomAt(vp.w / 2, vp.h / 2, 1.2);
  }

  zoomOut(): void {
    const vp = this.viewportSize();
    this.zoomAt(vp.w / 2, vp.h / 2, 1 / 1.2);
  }

  private zoomAt(px: number, py: number, factor: number): void {
    const z = this.zoom();
    const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z * factor));
    const wx = (px - this.pan().x) / z;
    const wy = (py - this.pan().y) / z;
    this.zoom.set(newZoom);
    this.pan.set({ x: px - wx * newZoom, y: py - wy * newZoom });
  }

  resetZoom(): void {
    this.zoom.set(1);
  }

  fit(): void {
    const b = this.contentBounds();
    if (!b) {
      this.zoom.set(1);
      this.pan.set({ x: 40, y: 40 });
      return;
    }
    const vp = this.viewportSize();
    const margin = 60;
    const w = Math.max(b.maxX - b.minX, 100);
    const h = Math.max(b.maxY - b.minY, 100);
    let z = Math.min((vp.w - 2 * margin) / w, (vp.h - 2 * margin) / h, 1.4);
    z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    this.zoom.set(z);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    this.pan.set({ x: vp.w / 2 - cx * z, y: vp.h / 2 - cy * z });
  }

  centerView(): void {
    const b = this.contentBounds();
    if (!b) return;
    const vp = this.viewportSize();
    const z = this.zoom();
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    this.pan.set({ x: vp.w / 2 - cx * z, y: vp.h / 2 - cy * z });
  }

  private contentBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    const ns = this.nodes();
    if (!ns.length) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const n of ns) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    }
    return { minX, minY, maxX, maxY };
  }

  // ── Delete / clear / sample ──────────────────────────────────────────
  deleteSelected(): void {
    if (this.selectedConnId()) {
      const id = this.selectedConnId();
      this.connections.update((arr) => arr.filter((c) => c.id !== id));
      this.selectedConnId.set(null);
      return;
    }
    if (this.selectedNodeId()) {
      this.deleteNodeWithConns(this.selectedNodeId()!);
    }
  }

  deleteNodeWithConns(id: string): void {
    const toRemove = new Set([id]);
    const children = this.childrenMap();
    const queue = [id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const k of children.get(cur) ?? []) {
        if (!toRemove.has(k)) {
          toRemove.add(k);
          queue.push(k);
        }
      }
    }
    this.nodes.update((arr) => arr.filter((n) => !toRemove.has(n.id)));
    this.connections.update((arr) => arr.filter((c) => !toRemove.has(c.from) && !toRemove.has(c.to)));
    this.selectedNodeId.set(null);
  }

  clearAll(): void {
    this.nodes.set([]);
    this.connections.set([]);
    this.clearSelection();
    this.pendingFrom.set(null);
    this.placingShape.set(null);
  }

  loadSample(kind: 'tree' | 'flow' = 'tree'): void {
    if (kind === 'flow') {
      this.loadFlowSample();
    } else {
      this.loadTreeSample();
    }
  }

  private loadTreeSample(): void {
    const N = (type: ShapeType, label: string): DiagramNode => this.createNode(type, 0, 0, label);
    const C = (from: DiagramNode, to: DiagramNode): DiagramConnection =>
      this.createConnection(from.id, to.id);

    const dir = N('ellipse', 'Diretoria');
    const tec = N('roundedRectangle', 'Tecnologia');
    const com = N('roundedRectangle', 'Comercial');
    const fin = N('roundedRectangle', 'Financeiro');
    const dev = N('rectangle', 'Desenvolvimento');
    const qa = N('rectangle', 'Qualidade');
    const ven = N('rectangle', 'Vendas');
    const mkt = N('rectangle', 'Marketing');
    const con = N('rectangle', 'Contábil');
    const tes = N('rectangle', 'Tesouraria');

    this.nodes.set([dir, tec, com, fin, dev, qa, ven, mkt, con, tes]);
    this.connections.set([
      C(dir, tec),
      C(dir, com),
      C(dir, fin),
      C(tec, dev),
      C(tec, qa),
      C(com, ven),
      C(com, mkt),
      C(fin, con),
      C(fin, tes),
    ]);
    this.layoutMode.set('tree');
    this.applyLayout('tree');
    this.clearSelection();
    this.pendingFrom.set(null);
    this.placingShape.set(null);
  }

  private loadFlowSample(): void {
    const N = (type: ShapeType, label: string): DiagramNode => this.createNode(type, 0, 0, label);
    const C = (from: DiagramNode, to: DiagramNode, label = ''): DiagramConnection =>
      this.createConnection(from.id, to.id, label);

    const s1 = N('circle', 'Início');
    const r1 = N('rectangle', 'Receber Requisição');
    const r2 = N('rectangle', 'Validar Orçamento');
    const d1 = N('diamond', 'Aprovado?');
    const r3 = N('rectangle', 'Emitir Pedido de Compra');
    const e1 = N('ellipse', 'Fornecedor');
    const r4 = N('rectangle', 'Receber Mercadoria');
    const d2 = N('diamond', 'Conferência OK?');
    const r5 = N('rectangle', 'Registrar no Estoque');
    const r6 = N('rectangle', 'Notificar Reprovação');
    const e2 = N('circle', 'Fim');

    this.nodes.set([s1, r1, r2, d1, r3, e1, r4, d2, r5, r6, e2]);
    this.connections.set([
      C(s1, r1, 'Início'),
      C(r1, r2),
      C(r2, d1),
      C(d1, r3, 'Sim'),
      C(d1, r6, 'Não'),
      C(r3, e1, 'Envio'),
      C(e1, r4, 'Entrega'),
      C(r4, d2),
      C(d2, r5, 'Sim'),
      C(d2, r6, 'Não'),
      C(r5, e2),
      C(r6, e2),
    ]);
    this.layoutMode.set('layered');
    this.applyLayout('layered');
    this.clearSelection();
    this.pendingFrom.set(null);
    this.placingShape.set(null);
  }

  // ── Layout algorithms ────────────────────────────────────────────────
  setLayoutMode(mode: LayoutMode): void {
    this.layoutMode.set(mode);
    this.applyLayout(mode);
  }

  toggleTreeDirection(): void {
    this.treeDirection.update((d) => (d === 'TB' ? 'LR' : 'TB'));
    if (this.layoutMode() === 'tree') this.applyLayout('tree');
  }

  applyLayout(mode: LayoutMode): void {
    const map = this.childrenMap();
    const roots = this.roots(map);
    if (!roots.length) return;
    let positions = new Map<string, Point>();
    if (mode === 'tree') {
      positions = this.treeLayout(map, roots);
    } else if (mode === 'layered') {
      positions = this.layeredLayout(map, roots);
    } else {
      positions = this.radialLayout(map, roots);
    }
    const margin = 80;
    let minX = Infinity,
      minY = Infinity;
    for (const p of positions.values()) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
    }
    const offsetX = margin - minX;
    const offsetY = margin - minY;
    this.nodes.update((arr) =>
      arr.map((n) => {
        const p = positions.get(n.id);
        return p ? { ...n, x: p.x + offsetX, y: p.y + offsetY } : n;
      }),
    );
    this.clearSelection();
  }

  private childrenMap(): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const n of this.nodes()) map.set(n.id, []);
    for (const c of this.connections()) {
      const kids = map.get(c.from);
      if (kids && !kids.includes(c.to)) kids.push(c.to);
    }
    return map;
  }

  private roots(map: Map<string, string[]>): string[] {
    const hasParent = new Set(this.connections().map((c) => c.to));
    return this.nodes().filter((n) => !hasParent.has(n.id)).map((n) => n.id);
  }

  private treeLayout(map: Map<string, string[]>, roots: string[]): Map<string, Point> {
    const dir = this.treeDirection();
    const GX = 90; // gap entre subárvores irmãs
    const GY = 90; // folga vertical entre níveis
    const subtreeW = new Map<string, number>();
    const visited = new Set<string>();

    // Largura da subárvore considerando apenas o primeiro pai (DAG seguro)
    const compute = (id: string): number => {
      if (visited.has(id)) return 0;
      visited.add(id);
      const n = this.nodeById(id);
      if (!n) return 0;
      const own = dir === 'TB' ? n.width : n.height;
      const kids = (map.get(id) ?? []).filter((k) => !visited.has(k) && this.nodeById(k));
      let w = own;
      if (kids.length) {
        w = Math.max(own, kids.reduce((s, k) => s + compute(k) + GX, 0) - GX);
      }
      subtreeW.set(id, w);
      return w;
    };

    // Altura de nível uniforme: espaçamento vertical constante e organizado
    let levelSpan = 0;
    for (const n of this.nodes()) levelSpan = Math.max(levelSpan, dir === 'TB' ? n.height : n.width);
    const levelH = levelSpan + GY;

    const pos = new Map<string, Point>();
    const placed = new Set<string>();
    const place = (id: string, start: number, depth: number): void => {
      if (placed.has(id)) return;
      placed.add(id);
      const n = this.nodeById(id);
      if (!n) return;
      const own = dir === 'TB' ? n.width : n.height;
      const along = start + ((subtreeW.get(id) ?? own) - own) / 2;
      const down = depth * levelH;
      pos.set(id, dir === 'TB' ? { x: along, y: down } : { x: down, y: along });
      let cur = start;
      for (const k of map.get(id) ?? []) {
        if (placed.has(k) || !subtreeW.has(k)) continue;
        place(k, cur, depth + 1);
        cur += (subtreeW.get(k) ?? 0) + GX;
      }
    };

    for (const r of roots) compute(r);
    let cursor = 0;
    for (const r of roots) {
      if (!subtreeW.has(r)) continue;
      place(r, cursor, 0);
      cursor += (subtreeW.get(r) ?? 0) + GX;
    }
    return pos;
  }

  private layeredLayout(map: Map<string, string[]>, roots: string[]): Map<string, Point> {
    // Camada = profundidade a partir da raiz (fluxo da esquerda para a direita)
    const layer = new Map<string, number>();
    const assign = (id: string, d: number): void => {
      if (d <= (layer.get(id) ?? -1)) return;
      layer.set(id, d);
      for (const k of map.get(id) ?? []) {
        if (this.nodeById(k)) assign(k, d + 1);
      }
    };
    for (const r of roots) assign(r, 0);
    for (const n of this.nodes()) if (!layer.has(n.id)) layer.set(n.id, 0);

    const groups = new Map<number, DiagramNode[]>();
    for (const n of this.nodes()) {
      const l = layer.get(n.id)!;
      if (!groups.has(l)) groups.set(l, []);
      groups.get(l)!.push(n);
    }
    const sorted = [...groups.keys()].sort((a, b) => a - b);
    const ROW_GAP = 60;

    // Espaçamento horizontal entre colunas baseado na maior largura de nó
    // (evita sobreposição quando há nós largos, como elipses)
    let maxW = 0;
    for (const n of this.nodes()) maxW = Math.max(maxW, n.width);
    const COL_GAP = maxW + 80;

    // Espaçamento vertical uniforme
    let maxH = 0;
    for (const n of this.nodes()) maxH = Math.max(maxH, n.height);
    const rowH = maxH + ROW_GAP;

    const pos = new Map<string, Point>();
    const maxColH = Math.max(...sorted.map((l) => (groups.get(l)!.length - 1) * rowH + maxH));
    for (const l of sorted) {
      const col = groups.get(l)!;
      const colH = (col.length - 1) * rowH + maxH;
      let yy = (maxColH - colH) / 2;
      for (const n of col) {
        pos.set(n.id, { x: l * COL_GAP, y: yy });
        yy += rowH;
      }
    }
    return pos;
  }

  private radialLayout(map: Map<string, string[]>, roots: string[]): Map<string, Point> {
    const STEP = 160;
    const CHAIN_ROT = Math.PI / 8; // gira cadeias de nós únicos para evitar raio reto

    // Árvore de primeiro-pai (DAG seguro)
    const children = new Map<string, string[]>();
    const parentOf = new Map<string, string>();
    const collect = (id: string): void => {
      const kids: string[] = [];
      for (const k of map.get(id) ?? []) {
        if (!this.nodeById(k) || parentOf.has(k)) continue;
        parentOf.set(k, id);
        kids.push(k);
        collect(k);
      }
      children.set(id, kids);
    };
    for (const r of roots) {
      if (!parentOf.has(r)) {
        parentOf.set(r, '');
        collect(r);
      }
    }

    // Contagem de folhas por subárvore (ponderação angular)
    const leafCount = new Map<string, number>();
    const count = (id: string): number => {
      if (leafCount.has(id)) return leafCount.get(id)!;
      const kids = children.get(id) ?? [];
      const s = kids.length ? kids.reduce((sum, k) => sum + count(k), 0) : 1;
      leafCount.set(id, s);
      return s;
    };
    for (const r of roots) if (parentOf.get(r) === '') count(r);

    const pos = new Map<string, Point>();
    const place = (id: string, start: number, end: number, depth: number): void => {
      const ang = (start + end) / 2;
      const r = depth * STEP;
      pos.set(id, { x: Math.cos(ang) * r, y: Math.sin(ang) * r });
      const kids = children.get(id) ?? [];
      const total = kids.reduce((s, k) => s + (leafCount.get(k) ?? 1), 0) || 1;
      let cur = start;
      for (const k of kids) {
        const span = ((end - start) * (leafCount.get(k) ?? 1)) / total;
        if (kids.length === 1) {
          // cadeia: gira o arco para criar uma espiral organizada
          place(k, start + CHAIN_ROT, end + CHAIN_ROT, depth + 1);
        } else {
          place(k, cur, cur + span, depth + 1);
        }
        cur += span;
      }
    };

    place(roots[0], 0, Math.PI * 2, 0);
    if (roots.length > 1) {
      const span = (Math.PI * 2) / (roots.length - 1);
      roots.slice(1).forEach((r, i) => {
        if (!parentOf.has(r)) return;
        const ang = Math.PI + span * (i + 0.5);
        pos.set(r, { x: Math.cos(ang) * STEP, y: Math.sin(ang) * STEP });
      });
    }
    return pos;
  }

  // ── Connection geometry ──────────────────────────────────────────────
  boundaryPoint(node: DiagramNode, tx: number, ty: number): Point {
    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    const dx = tx - cx;
    const dy = ty - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const rx = node.width / 2;
    const ry = node.height / 2;
    let t = 1;
    if (node.type === 'diamond') {
      const d = Math.abs(dx) / rx + Math.abs(dy) / ry;
      t = d === 0 ? 1 : 1 / d;
    } else if (node.type === 'ellipse' || node.type === 'circle') {
      t = 1 / Math.sqrt(Math.pow(dx / rx, 2) + Math.pow(dy / ry, 2));
    } else {
      const sx = dx !== 0 ? rx / Math.abs(dx) : Infinity;
      const sy = dy !== 0 ? ry / Math.abs(dy) : Infinity;
      t = Math.min(sx, sy);
    }
    return { x: cx + dx * t, y: cy + dy * t };
  }

  connStart(conn: DiagramConnection): Point {
    const from = this.nodeById(conn.from);
    const to = this.nodeById(conn.to);
    if (!from || !to) return { x: 0, y: 0 };
    return this.boundaryPoint(from, to.x + to.width / 2, to.y + to.height / 2);
  }

  connEnd(conn: DiagramConnection): Point {
    const from = this.nodeById(conn.from);
    const to = this.nodeById(conn.to);
    if (!from || !to) return { x: 0, y: 0 };
    return this.boundaryPoint(to, from.x + from.width / 2, from.y + from.height / 2);
  }

  private bezierControls(s: Point, e: Point): [Point, Point] {
    const dx = e.x - s.x;
    const dy = e.y - s.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const off = dx * 0.5;
      return [
        { x: s.x + off, y: s.y },
        { x: e.x - off, y: e.y },
      ];
    }
    const off = dy * 0.5;
    return [
      { x: s.x, y: s.y + off },
      { x: e.x, y: e.y - off },
    ];
  }

  connectionPath(conn: DiagramConnection): string {
    const s = this.connStart(conn);
    const e = this.connEnd(conn);
    if (conn.style === 'straight') return `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
    if (conn.style === 'orthogonal') {
      const my = (s.y + e.y) / 2;
      return `M ${s.x} ${s.y} L ${s.x} ${my} L ${e.x} ${my} L ${e.x} ${e.y}`;
    }
    const [c1, c2] = this.bezierControls(s, e);
    return `M ${s.x} ${s.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${e.x} ${e.y}`;
  }

  labelPos(conn: DiagramConnection): Point {
    const s = this.connStart(conn);
    const e = this.connEnd(conn);
    if (conn.style === 'bezier') {
      const [c1, c2] = this.bezierControls(s, e);
      return {
        x: 0.125 * s.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * e.x,
        y: 0.125 * s.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * e.y,
      };
    }
    return { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
  }

  labelBox(conn: DiagramConnection): { x: number; y: number; w: number; h: number } {
    const p = this.labelPos(conn);
    const w = Math.max(conn.label.length * 6.5 + 18, 30);
    const h = 20;
    return { x: p.x - w / 2, y: p.y - h / 2, w, h };
  }

  tempLinePath(): string {
    const fromId = this.pendingFrom();
    const cur = this.cursor();
    if (!fromId || !cur) return '';
    const from = this.nodeById(fromId);
    if (!from) return '';
    const s = this.boundaryPoint(from, cur.x, cur.y);
    return `M ${s.x} ${s.y} L ${cur.x} ${cur.y}`;
  }

  colorKey(color: string): string {
    return 'm' + color.replace(/[^a-zA-Z0-9]/g, '');
  }

  arrowUrl(color: string, _end: 'start' | 'end'): string {
    return `url(#arrow-${this.colorKey(color)})`;
  }

  // ── Shape SVG (used by template) ─────────────────────────────────────
  shapeStroke(node: DiagramNode): string {
    return node.stroke === 'transparent' ? 'none' : node.stroke;
  }

  circleRadius(node: DiagramNode): number {
    return Math.min(node.width, node.height) / 2;
  }

  diamondPoints(node: DiagramNode): string {
    const { width: w, height: h } = node;
    return `${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`;
  }

  parallelogramPoints(node: DiagramNode): string {
    const { width: w, height: h } = node;
    return `${w * 0.16},0 ${w},0 ${w * 0.84},${h} 0,${h}`;
  }

  handleCursor(h: HandleDef): string {
    switch (h.id) {
      case 'nw':
      case 'se':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      default:
        return 'move';
    }
  }

  gridTransform(): string {
    const z = this.zoom();
    const g = this.GRID * z;
    const tx = ((this.pan().x % g) + g) % g;
    const ty = ((this.pan().y % g) + g) % g;
    return `translate(${tx},${ty}) scale(${z})`;
  }

  // ── Export ───────────────────────────────────────────────────────────
  exportSVG(): void {
    const svg = this.svgString();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    this.downloadBlob(blob, 'diagrama.svg');
  }

  exportPNG(): void {
    const svg = this.svgString();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((png) => {
        if (png) this.downloadBlob(png, 'diagrama.png');
      }, 'image/png');
    };
    img.src = url;
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  private svgString(): string {
    const b = this.contentBounds();
    const pad = 50;
    const minX = b ? b.minX - pad : 0;
    const minY = b ? b.minY - pad : 0;
    const w = Math.max(b ? b.maxX - b.minX + pad * 2 : 600, 400);
    const h = Math.max(b ? b.maxY - b.minY + pad * 2 : 400, 300);
    const markers = this.markerColors()
      .map(
        (color) =>
          `<marker id="arrow-${this.colorKey(color)}" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M2,2 L10,6 L2,10 Z" fill="${color}"/></marker>`,
      )
      .join('');
    const body =
      this.connections().map((c) => this.connSvgString(c)).join('') +
      this.nodes().map((n) => this.nodeSvgString(n)).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${minX} ${minY} ${w} ${h}" font-family="Poppins, Nunito Sans, Arial, sans-serif"><defs>${markers}</defs><rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="#ffffff"/>${body}</svg>`;
  }

  private esc(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private nodeSvgString(n: DiagramNode): string {
    const { x, y, width: w, height: h } = n;
    const shape = this.shapeElementString(n);
    const fill = n.fill === 'transparent' ? 'none' : n.fill;
    const stroke = this.shapeStroke(n);
    const font = `${n.fontBold ? 'bold ' : ''}${n.fontSize}px`;
    const label = this.esc(n.label);
    const textY = n.type === 'text' ? h / 2 : h / 2;
    return `<g transform="translate(${x} ${y})">${shape}<text x="${w / 2}" y="${textY}" text-anchor="middle" dominant-baseline="central" font-size="${n.fontSize}" font-family="Poppins, Nunito Sans, Arial, sans-serif" font-weight="${n.fontBold ? 700 : 400}" fill="${n.fontColor}">${label}</text><g stroke="#3b82f6" stroke-width="1" fill="none" opacity="0">${shape}</g></g>`;
  }

  private shapeElementString(n: DiagramNode): string {
    const { x: _, y: __, width: w, height: h } = n;
    const fill = n.fill === 'transparent' ? 'none' : n.fill;
    const stroke = this.shapeStroke(n);
    const sw = n.stroke === 'transparent' ? 0 : n.strokeWidth;
    const common = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}"`;
    switch (n.type) {
      case 'roundedRectangle':
        return `<rect width="${w}" height="${h}" rx="10" ${common}/>`;
      case 'ellipse':
        return `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" ${common}/>`;
      case 'circle':
        return `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2}" ${common}/>`;
      case 'diamond':
        return `<polygon points="${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}" ${common}/>`;
      case 'parallelogram':
        return `<polygon points="${w * 0.16},0 ${w},0 ${w * 0.84},${h} 0,${h}" ${common}/>`;
      case 'text':
        return `<rect width="${w}" height="${h}" fill="none" stroke="none"/>`;
      default:
        return `<rect width="${w}" height="${h}" rx="2" ${common}/>`;
    }
  }

  private connSvgString(c: DiagramConnection): string {
    const d = this.connectionPath(c);
    const dash = c.dashed ? ' stroke-dasharray="6 4"' : '';
    const start = c.arrowStart ? ` marker-start="url(#arrow-${this.colorKey(c.color)})"` : '';
    const end = c.arrowEnd ? ` marker-end="url(#arrow-${this.colorKey(c.color)})"` : '';
    const label = c.label
      ? (() => {
          const b = this.labelBox(c);
          const t = this.esc(c.label);
          return `<g><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="9" fill="#ffffff" stroke="#e2e8f0"/><text x="${b.x + b.w / 2}" y="${b.y + b.h / 2}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="#475569">${t}</text></g>`;
        })()
      : '';
    return `<path d="${d}" fill="none" stroke="${c.color}" stroke-width="${c.strokeWidth}"${dash}${start}${end}/>${label}`;
  }
}
