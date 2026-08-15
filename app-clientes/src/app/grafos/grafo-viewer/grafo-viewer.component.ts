import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { PoButtonModule } from '@po-ui/ng-components';

// ── API pública do componente (padrão PO-UI) ─────────────────────────────

/** Nó de entrada, informado pelo consumidor do componente. */
export interface GraphNodeInput {
  id: string;
  label?: string;
  group?: string;
}

/** Aresta de entrada, informada pelo consumidor do componente. */
export interface GraphEdgeInput {
  from: string;
  to: string;
  label?: string;
}

/** Evento emitido ao clicar em um nó do grafo. */
export interface GraphNodeClickEvent {
  node: GraphNodeInput;
  layer: number;
}

// ── Tipos internos ────────────────────────────────────────────────────────

interface PlacedNode {
  id: string;
  label: string;
  group?: string;
  layer: number;
  x: number;
  y: number;
}

interface RoutedEdge {
  from: string;
  to: string;
  label?: string;
  d: string;
  lx: number;
  ly: number;
  /** Camada do nó de origem (cor/marker resolvidos no layout). */
  layer: number;
  color: string;
  marker: string;
}

interface BuiltGraph {
  nodes: PlacedNode[];
  edges: RoutedEdge[];
  layers: string[][];
  width: number;
  height: number;
}

/**
 * Visualizador de grafos em camadas, reutilizável.
 *
 * Recebe os nós e as arestas via inputs, calcula automaticamente o layout
 * em camadas (com arestas ortogonais), e disponibiliza zoom, pan, legenda,
 * rótulos de arestas e exportação para SVG.
 */
@Component({
  selector: 'app-grafo-viewer',
  imports: [CommonModule, PoButtonModule],
  templateUrl: './grafo-viewer.component.html',
  styleUrl: './grafo-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrafoViewerComponent implements OnDestroy {
  // ── Inputs (padrão PO-UI: prefixo `p-`) ────────────────────────────────

  /** Lista de nós a serem exibidos. */
  readonly pNodes = input<GraphNodeInput[]>([]);

  /** Lista de arestas a serem exibidas. */
  readonly pEdges = input<GraphEdgeInput[]>([]);

  /** Exibe ou oculta a toolbar (exportação, zoom e estatísticas). */
  readonly pShowToolbar = input(true);

  /** Exibe ou oculta a legenda de camadas. */
  readonly pShowLegend = input(true);

  // ── Outputs (padrão PO-UI: prefixo `p-`) ───────────────────────────────

  /** Emitido quando um nó é clicado (mouse ou teclado). */
  readonly pNodeClick = output<GraphNodeClickEvent>();

  // ── Constantes de layout ────────────────────────────────────────────────

  readonly NODE_W = 200;
  readonly NODE_H = 60;
  readonly H_GAP = 56;
  readonly V_GAP = 88;
  readonly PADDING = 64;

  readonly LAYER_COLORS = [
    '#6366f1',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ec4899',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#22c55e',
    '#e11d48',
  ];

  readonly ZOOM_MIN = 0.3;
  readonly ZOOM_MAX = 2.5;
  readonly ZOOM_STEP = 0.2;

  // ── Estado reativo ──────────────────────────────────────────────────────

  zoom = signal(1);
  isPanning = signal(false);
  hovered = signal<string | null>(null);

  @ViewChild('gfScroll') gfScroll!: ElementRef<HTMLElement>;

  // ── Derivados (layout reativo a partir dos inputs) ──────────────────────

  private readonly built = computed(() => this.computeLayout(this.pNodes(), this.pEdges()));

  readonly nodes = computed(() => this.built().nodes);
  readonly edges = computed(() => this.built().edges);
  readonly layers = computed(() => this.built().layers);
  readonly canvasW = computed(() => this.built().width);
  readonly canvasH = computed(() => this.built().height);

  readonly adjacency = computed(() => {
    const m = new Map<string, Set<string>>();
    const ensure = (id: string) => {
      if (!m.has(id)) m.set(id, new Set());
    };
    for (const e of this.edges()) {
      ensure(e.from);
      ensure(e.to);
      m.get(e.from)!.add(e.to);
      m.get(e.to)!.add(e.from);
    }
    return m;
  });

  /** Nós a esmaecer durante o hover (derivado de hovered() + adjacency()). */
  readonly dimSet = computed(() => {
    const h = this.hovered();
    if (h === null) return null;
    const neighbors = this.adjacency().get(h);
    const set = new Set<string>();
    for (const n of this.nodes()) {
      if (n.id !== h && !neighbors?.has(n.id)) set.add(n.id);
    }
    return set;
  });

  readonly statNodes = computed(() => this.nodes().length);
  readonly statEdges = computed(() => this.edges().length);
  readonly statLayers = computed(() => this.layers().length);
  readonly zoomPercent = computed(() => Math.round(this.zoom() * 100));

  constructor() {
    // Sempre que os dados mudam, restaura o zoom e a posição do canvas.
    effect(() => {
      this.built();
      this.zoom.set(1);
      this.scrollToTopLeft();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onPanMove);
    window.removeEventListener('mouseup', this.onPanUp);
  }

  // ── Helpers públicos de template ────────────────────────────────────────

  layerColor(li: number): string {
    return this.LAYER_COLORS[li % this.LAYER_COLORS.length];
  }

  isEdgeActive(e: RoutedEdge): boolean {
    const h = this.hovered();
    return h === null || e.from === h || e.to === h;
  }

  trackNode(_i: number, n: PlacedNode): string {
    return n.id;
  }

  trackEdge(i: number, e: RoutedEdge): string {
    return `${i}:${e.from}>${e.to}`;
  }

  // ── Interações ──────────────────────────────────────────────────────────

  onNodeClick(n: PlacedNode): void {
    this.pNodeClick.emit({ node: { id: n.id, label: n.label, group: n.group }, layer: n.layer });
  }

  onNodeKeydown(event: KeyboardEvent, n: PlacedNode): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onNodeClick(n);
    }
  }

  zoomIn(): void {
    this.zoom.update((z) => Math.min(this.ZOOM_MAX, +(z + this.ZOOM_STEP).toFixed(2)));
  }

  zoomOut(): void {
    this.zoom.update((z) => Math.max(this.ZOOM_MIN, +(z - this.ZOOM_STEP).toFixed(2)));
  }

  resetView(): void {
    this.zoom.set(1);
    this.scrollToTopLeft();
  }

  // ── Pan (arrastar com o mouse move as barras de rolagem) ────────────────

  private dragStart = { x: 0, y: 0, scrollX: 0, scrollY: 0 };

  onCanvasMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.hovered.set(null);
    const el = this.gfScroll?.nativeElement;
    if (!el) return;
    this.dragStart = {
      x: event.clientX,
      y: event.clientY,
      scrollX: el.scrollLeft,
      scrollY: el.scrollTop,
    };
    this.isPanning.set(true);
    window.addEventListener('mousemove', this.onPanMove);
    window.addEventListener('mouseup', this.onPanUp);
  }

  private onPanMove = (event: MouseEvent): void => {
    const el = this.gfScroll?.nativeElement;
    if (!el) return;
    el.scrollLeft = this.dragStart.scrollX - (event.clientX - this.dragStart.x);
    el.scrollTop = this.dragStart.scrollY - (event.clientY - this.dragStart.y);
  };

  private onPanUp = (): void => {
    this.isPanning.set(false);
    window.removeEventListener('mousemove', this.onPanMove);
    window.removeEventListener('mouseup', this.onPanUp);
  };

  private scrollToTopLeft(): void {
    setTimeout(() => {
      const el = this.gfScroll?.nativeElement;
      if (el) {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    });
  }

  // ── Export SVG ──────────────────────────────────────────────────────────

  exportSvg(): void {
    const w = this.canvasW();
    const h = this.canvasH();
    const parts: string[] = [];
    parts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Segoe UI, Arial, sans-serif">`
    );
    parts.push(`<rect width="${w}" height="${h}" fill="#f8fafc"/>`);
    parts.push('<defs>');
    this.LAYER_COLORS.forEach((color, i) => {
      parts.push(
        `<marker id="gf-arrow-${i}" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="userSpaceOnUse"><polygon points="0 0, 12 4, 0 8" fill="${color}"/></marker>`
      );
    });
    parts.push('</defs>');
    for (const e of this.edges()) {
      parts.push(
        `<path d="${e.d}" fill="none" stroke="${e.color}" stroke-width="2" marker-end="${e.marker}"/>`
      );
      if (e.label) {
        parts.push(
          `<text x="${e.lx}" y="${e.ly - 6}" text-anchor="middle" font-size="11" fill="#334155">${this.esc(e.label)}</text>`
        );
      }
    }
    for (const n of this.nodes()) {
      const c = this.layerColor(n.layer);
      parts.push(
        `<rect x="${n.x}" y="${n.y}" width="${this.NODE_W}" height="${this.NODE_H}" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>`
      );
      parts.push(`<rect x="${n.x}" y="${n.y}" width="6" height="${this.NODE_H}" fill="${c}"/>`);
      parts.push(
        `<text x="${n.x + 20}" y="${n.y + this.NODE_H / 2 + 5}" font-size="13" font-weight="600" fill="#0f172a">${this.esc(n.label)}</text>`
      );
    }
    parts.push('</svg>');

    const blob = new Blob([parts.join('')], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grafo-camadas.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  private esc(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Layout em camadas (função pura, sem estado do componente) ───────────

  private computeLayout(inputNodes: GraphNodeInput[], inputEdges: GraphEdgeInput[]): BuiltGraph {
    const nodes = [...inputNodes];
    const edges = [...inputEdges];

    // Garante nós referenciados por arestas
    const idSet = new Set(nodes.map((n) => n.id));
    for (const e of edges) {
      if (!idSet.has(e.from)) {
        nodes.push({ id: e.from, label: e.from });
        idSet.add(e.from);
      }
      if (!idSet.has(e.to)) {
        nodes.push({ id: e.to, label: e.to });
        idSet.add(e.to);
      }
    }

    // 1) Atribuição de camadas (caminho mais longo, tolerante a ciclos)
    const preds = new Map<string, string[]>();
    for (const n of nodes) preds.set(n.id, []);
    for (const e of edges) preds.get(e.to)?.push(e.from);
    const layerMap = this.assignLayers(nodes, preds);

    // 2) Agrupar por camada
    const byLayer: string[][] = [];
    for (const n of nodes) {
      const li = layerMap.get(n.id) ?? 0;
      while (byLayer.length <= li) byLayer.push([]);
      byLayer[li].push(n.id);
    }

    // 3) Ordenar por barycenter (reduz cruzamentos)
    const ordered = this.orderByBarycenter(byLayer, edges);

    // 4) Posicionar (camadas centralizadas)
    const placed = this.placeNodes(ordered);

    // 5) Montar nós posicionados
    const plNodes: PlacedNode[] = [];
    const map = new Map<string, PlacedNode>();
    for (const n of nodes) {
      const p = placed.get(n.id)!;
      const pn: PlacedNode = {
        id: n.id,
        label: n.label || n.id,
        layer: p.layer,
        x: p.x,
        y: p.y,
        group: n.group,
      };
      plNodes.push(pn);
      map.set(n.id, pn);
    }

    // 6) Roteamento ortogonal das arestas
    const plEdges: RoutedEdge[] = edges.map((e) => {
      const f = map.get(e.from)!;
      const t = map.get(e.to)!;
      const r = this.route(f, t, plNodes);
      return {
        from: e.from,
        to: e.to,
        label: e.label,
        d: r.d,
        lx: r.lx,
        ly: r.ly,
        layer: f.layer,
        color: this.LAYER_COLORS[f.layer % this.LAYER_COLORS.length],
        marker: `url(#gf-arrow-${f.layer % this.LAYER_COLORS.length})`,
      };
    });

    // 7) Tamanho do canvas
    let maxX = 0;
    let maxY = 0;
    for (const n of plNodes) {
      maxX = Math.max(maxX, n.x + this.NODE_W);
      maxY = Math.max(maxY, n.y + this.NODE_H);
    }

    return {
      nodes: plNodes,
      edges: plEdges,
      layers: ordered.map((l) => [...l]),
      width: Math.max(maxX + this.PADDING, 700),
      height: Math.max(maxY + this.PADDING, 400),
    };
  }

  private assignLayers(nodes: GraphNodeInput[], preds: Map<string, string[]>): Map<string, number> {
    const layer = new Map<string, number>();
    const remaining = new Set(nodes.map((n) => n.id));
    let guard = 0;
    while (remaining.size > 0 && guard < 10000) {
      guard++;
      let progressed = false;
      for (const id of [...remaining]) {
        const ps = preds.get(id) ?? [];
        const known = ps.filter((p) => layer.has(p));
        if (ps.length === 0 || known.length === ps.length) {
          const maxPred = known.length ? Math.max(...known.map((p) => layer.get(p)!)) : -1;
          layer.set(id, maxPred + 1);
          remaining.delete(id);
          progressed = true;
        }
      }
      if (!progressed) {
        // componente com ciclo: quebra atribuindo o primeiro restante
        const next = remaining.values().next();
        if (next.done) break;
        layer.set(next.value, 0);
        remaining.delete(next.value);
      }
    }
    for (const id of remaining) layer.set(id, 0);
    return layer;
  }

  private orderByBarycenter(layers: string[][], edges: GraphEdgeInput[]): string[][] {
    const adj = new Map<string, Set<string>>();
    const ensure = (id: string) => {
      if (!adj.has(id)) adj.set(id, new Set());
    };
    for (const e of edges) {
      ensure(e.from);
      ensure(e.to);
      adj.get(e.from)!.add(e.to);
      adj.get(e.to)!.add(e.from);
    }
    const result = layers.map((l) => [...l]);
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 1; i < result.length; i++) {
        this.sortLayerByReference(result, i, -1, adj);
      }
      for (let i = result.length - 2; i >= 0; i--) {
        this.sortLayerByReference(result, i, 1, adj);
      }
    }
    return result;
  }

  private sortLayerByReference(
    layers: string[][],
    li: number,
    dir: -1 | 1,
    adj: Map<string, Set<string>>
  ): void {
    const ref = layers[li + dir];
    const pos = new Map(ref.map((id, idx) => [id, idx]));
    const cur = layers[li];
    const curPos = new Map(cur.map((id, idx) => [id, idx]));
    const bary = (id: string): number => {
      const nbs = adj.get(id) ?? new Set<string>();
      const hits = [...nbs].filter((n) => pos.has(n)).map((n) => pos.get(n)!);
      if (hits.length === 0) return curPos.get(id) ?? 0;
      return hits.reduce((a, b) => a + b, 0) / hits.length;
    };
    layers[li] = [...cur].sort((a, b) => bary(a) - bary(b));
  }

  private placeNodes(
    layers: string[][]
  ): Map<string, { x: number; y: number; layer: number }> {
    const maxCount = Math.max(1, ...layers.map((l) => l.length));
    const step = this.NODE_W + this.H_GAP;
    const maxBlock = (maxCount - 1) * step;
    const placed = new Map<string, { x: number; y: number; layer: number }>();
    layers.forEach((ids, li) => {
      const block = (ids.length - 1) * step;
      const startX = this.PADDING + (maxBlock - block) / 2;
      const y = this.PADDING + li * (this.NODE_H + this.V_GAP);
      ids.forEach((id, j) => placed.set(id, { x: startX + j * step, y, layer: li }));
    });
    return placed;
  }

  // ── Roteamento ortogonal ────────────────────────────────────────────────

  private route(from: PlacedNode, to: PlacedNode, all: PlacedNode[]): { d: string; lx: number; ly: number } {
    if (from.id === to.id) {
      const x = from.x + this.NODE_W / 2;
      const y = from.y;
      return {
        d: `M ${x - 16} ${y} Q ${x - 32} ${y - 40} ${x} ${y - 40} Q ${x + 32} ${y - 40} ${x + 16} ${y}`,
        lx: x,
        ly: y - 40,
      };
    }
    if (to.layer > from.layer) return this.elbow(from, to, all);
    return this.side(from, to);
  }

  private elbow(from: PlacedNode, to: PlacedNode, all: PlacedNode[]): { d: string; lx: number; ly: number } {
    const sx = from.x + this.NODE_W / 2;
    const sy = from.y + this.NODE_H;
    const tx = to.x + this.NODE_W / 2;
    const ty = to.y;
    const mid = (sy + ty) / 2;
    const others = all.filter((n) => n.id !== from.id && n.id !== to.id);

    const cand = new Set<number>([mid]);
    for (const n of others) {
      if (Math.max(sx, tx) < n.x || Math.min(sx, tx) > n.x + this.NODE_W) continue;
      cand.add(n.y - 16);
      cand.add(n.y + this.NODE_H + 16);
    }
    const sorted = [...cand].sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    for (const ey of sorted) {
      if (
        this.vClear(sx, sy, ey, others) &&
        this.hClear(ey, sx, tx, others) &&
        this.vClear(tx, ey, ty, others)
      ) {
        return { d: `M ${sx} ${sy} L ${sx} ${ey} L ${tx} ${ey} L ${tx} ${ty}`, lx: (sx + tx) / 2, ly: ey };
      }
    }
    return this.side(from, to);
  }

  private side(from: PlacedNode, to: PlacedNode): { d: string; lx: number; ly: number } {
    const sCx = from.x + this.NODE_W / 2;
    const tCx = to.x + this.NODE_W / 2;
    const sMidY = from.y + this.NODE_H / 2;
    const tMidY = to.y + this.NODE_H / 2;
    const LANE = 48;
    const toRight = tCx >= sCx;
    const exitX = toRight ? from.x + this.NODE_W : from.x;
    const enterX = toRight ? to.x + this.NODE_W : to.x;
    const laneX = toRight ? enterX + LANE : enterX - LANE;
    return {
      d: `M ${exitX} ${sMidY} L ${laneX} ${sMidY} L ${laneX} ${tMidY} L ${enterX} ${tMidY}`,
      lx: laneX,
      ly: (sMidY + tMidY) / 2,
    };
  }

  private vClear(x: number, y1: number, y2: number, nodes: PlacedNode[]): boolean {
    const a = Math.min(y1, y2);
    const b = Math.max(y1, y2);
    return !nodes.some(
      (n) =>
        x > n.x - 8 &&
        x < n.x + this.NODE_W + 8 &&
        b > n.y - 8 &&
        a < n.y + this.NODE_H + 8
    );
  }

  private hClear(y: number, x1: number, x2: number, nodes: PlacedNode[]): boolean {
    const a = Math.min(x1, x2);
    const b = Math.max(x1, x2);
    return !nodes.some(
      (n) =>
        y > n.y - 8 &&
        y < n.y + this.NODE_H + 8 &&
        b > n.x - 8 &&
        a < n.x + this.NODE_W + 8
    );
  }
}
