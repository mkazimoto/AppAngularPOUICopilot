import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
} from '@po-ui/ng-components';

// ── Tipos do JSON de entrada ─────────────────────────────────────────────
export interface GraphNodeInput {
  id: string;
  label?: string;
  group?: string;
}

export interface GraphEdgeInput {
  from: string;
  to: string;
  label?: string;
}

// ── Tipos internos ────────────────────────────────────────────────────────
interface Parsed {
  nodes: GraphNodeInput[];
  edges: GraphEdgeInput[];
}

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
}

interface Sample {
  key: string;
  label: string;
  json: string;
}

@Component({
  selector: 'app-grafos',
  imports: [
    CommonModule,
    FormsModule,
    PoButtonModule,
    PoFieldModule,
    PoModalModule,
    PoPageModule,
  ],
  templateUrl: './grafos.html',
  styleUrl: './grafos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grafos {
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

  // ── Amostras ────────────────────────────────────────────────────────────
  readonly samples: Sample[] = [
    {
      key: 'fluxo',
      label: 'Fluxo de dados',
      json: `{
  "nodes": [
    { "id": "n1", "label": "Início", "group": "Entrada" },
    { "id": "n2", "label": "Receber pedido", "group": "Processo" },
    { "id": "n3", "label": "Validar pagamento", "group": "Processo" },
    { "id": "n4", "label": "Verificar estoque", "group": "Processo" },
    { "id": "n5", "label": "Processar pedido", "group": "Processo" },
    { "id": "n6", "label": "Enviar confirmação", "group": "Saída" },
    { "id": "n7", "label": "Gerar nota fiscal", "group": "Saída" },
    { "id": "n8", "label": "Fim", "group": "Saída" }
  ],
  "edges": [
    { "from": "n1", "to": "n2" },
    { "from": "n2", "to": "n3" },
    { "from": "n2", "to": "n4" },
    { "from": "n3", "to": "n5", "label": "aprovado" },
    { "from": "n4", "to": "n5" },
    { "from": "n5", "to": "n6" },
    { "from": "n5", "to": "n7" },
    { "from": "n6", "to": "n8" },
    { "from": "n7", "to": "n8" }
  ]
}`,
    },
    {
      key: 'ciclos',
      label: 'Rede com ciclos',
      json: `{
  "nodes": [
    { "id": "a", "label": "Serviço A" },
    { "id": "b", "label": "Serviço B" },
    { "id": "c", "label": "Serviço C" },
    { "id": "d", "label": "Serviço D" },
    { "id": "e", "label": "Fila" },
    { "id": "f", "label": "Cache" }
  ],
  "edges": [
    { "from": "a", "to": "b" },
    { "from": "b", "to": "c" },
    { "from": "c", "to": "a", "label": "retry" },
    { "from": "b", "to": "e" },
    { "from": "e", "to": "f" },
    { "from": "f", "to": "b", "label": "recarga" },
    { "from": "d", "to": "e" },
    { "from": "d", "to": "c" }
  ]
}`,
    },
    {
      key: 'projetos',
      label: 'Hierarquia de projetos',
      json: `{
  "nodes": [
    { "id": "p1", "label": "Projeto Alpha", "group": "Direção" },
    { "id": "p2", "label": "Backend", "group": "Tecnologia" },
    { "id": "p3", "label": "Frontend", "group": "Tecnologia" },
    { "id": "p4", "label": "Dados", "group": "Tecnologia" },
    { "id": "p5", "label": "API", "group": "Backend" },
    { "id": "p6", "label": "Auth", "group": "Backend" },
    { "id": "p7", "label": "UI", "group": "Frontend" },
    { "id": "p8", "label": "Relatórios", "group": "Dados" },
    { "id": "p9", "label": "Testes", "group": "QA" },
    { "id": "p10", "label": "Publicação", "group": "Ops" }
  ],
  "edges": [
    { "from": "p1", "to": "p2" },
    { "from": "p1", "to": "p3" },
    { "from": "p1", "to": "p4" },
    { "from": "p2", "to": "p5" },
    { "from": "p2", "to": "p6" },
    { "from": "p3", "to": "p7" },
    { "from": "p4", "to": "p8" },
    { "from": "p5", "to": "p9" },
    { "from": "p7", "to": "p9" },
    { "from": "p8", "to": "p9" },
    { "from": "p9", "to": "p10" }
  ]
}`,
    },
    {
      key: 'rede',
      label: 'Rede densa (sensores)',
      json: `{
  "nodes": [
    { "id": "s1", "label": "Sensor 1" },
    { "id": "s2", "label": "Sensor 2" },
    { "id": "s3", "label": "Sensor 3" },
    { "id": "m1", "label": "Módulo A" },
    { "id": "m2", "label": "Módulo B" },
    { "id": "m3", "label": "Módulo C" },
    { "id": "out", "label": "Saída" }
  ],
  "edges": [
    { "from": "s1", "to": "m1" },
    { "from": "s1", "to": "m3" },
    { "from": "s2", "to": "m1" },
    { "from": "s2", "to": "m2" },
    { "from": "s3", "to": "m2" },
    { "from": "s3", "to": "m3" },
    { "from": "m1", "to": "out" },
    { "from": "m2", "to": "out" },
    { "from": "m3", "to": "out" }
  ]
}`,
    },
  ];

  readonly sampleOptions = this.samples.map((s) => ({ label: s.label, value: s.key }));

  readonly jsonPlaceholder = '{ "nodes": [...], "edges": [...] }';

  // ── Estado reativo ──────────────────────────────────────────────────────
  nodes = signal<PlacedNode[]>([]);
  edges = signal<RoutedEdge[]>([]);
  layers = signal<string[][]>([]);
  canvasW = signal(900);
  canvasH = signal(500);
  zoom = signal(1);
  hovered = signal<string | null>(null);
  showEdgeLabels = signal(true);
  jsonText = signal('');
  errorMsg = signal('');
  selectedSample = signal(this.samples[0].key);

  // ── Derivados ───────────────────────────────────────────────────────────
  readonly nodeById = computed(() => new Map(this.nodes().map((n) => [n.id, n])));

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

  readonly statNodes = computed(() => this.nodes().length);
  readonly statEdges = computed(() => this.edges().length);
  readonly statLayers = computed(() => this.layers().length);
  readonly zoomPercent = computed(() => Math.round(this.zoom() * 100));

  @ViewChild('jsonModal') jsonModal!: PoModalComponent;

  primaryAction: PoModalAction = {
    label: 'Aplicar',
    action: () => {
      this.applyJson();
      this.jsonModal.close();
    },
  };

  secondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.jsonModal.close(),
  };

  constructor() {
    this.applySample(this.selectedSample());
  }

  // ── Helpers públicos de template ────────────────────────────────────────

  layerColor(li: number): string {
    return this.LAYER_COLORS[li % this.LAYER_COLORS.length];
  }

  edgeStroke(e: RoutedEdge): string {
    const f = this.nodeById().get(e.from);
    return f ? this.layerColor(f.layer) : '#94a3b8';
  }

  edgeMarker(e: RoutedEdge): string {
    const f = this.nodeById().get(e.from);
    const li = f ? f.layer : 0;
    return `url(#gf-arrow-${li % this.LAYER_COLORS.length})`;
  }

  isNodeDim(id: string): boolean {
    const h = this.hovered();
    return h !== null && h !== id && !this.adjacency().get(h)?.has(id);
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

  // ── Amostras / JSON ─────────────────────────────────────────────────────

  applySample(key: string): void {
    const s = this.samples.find((x) => x.key === key) ?? this.samples[0];
    this.selectedSample.set(s.key);
    this.jsonText.set(s.json);
    this.applyJson(s.json);
  }

  onJsonChange(text: string): void {
    this.jsonText.set(text);
  }

  applyJson(text?: string): void {
    const parsed = this.parseJson(text ?? this.jsonText());
    if (!parsed) return;
    this.buildLayout(parsed);
  }

  openJsonModal(): void {
    this.jsonModal.open();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      this.jsonText.set(text);
      this.applyJson(text);
    };
    reader.readAsText(file);
    (event.target as HTMLInputElement).value = '';
  }

  // ── Zoom ────────────────────────────────────────────────────────────────

  zoomIn(): void {
    this.zoom.update((z) => Math.min(this.ZOOM_MAX, +(z + this.ZOOM_STEP).toFixed(2)));
  }

  zoomOut(): void {
    this.zoom.update((z) => Math.max(this.ZOOM_MIN, +(z - this.ZOOM_STEP).toFixed(2)));
  }

  resetZoom(): void {
    this.zoom.set(1);
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
        `<path d="${e.d}" fill="none" stroke="${this.edgeStroke(e)}" stroke-width="2" marker-end="${this.edgeMarker(e)}"/>`
      );
      if (e.label && this.showEdgeLabels()) {
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

  // ── Parsing do JSON ─────────────────────────────────────────────────────

  private parseJson(text: string): Parsed | null {
    this.errorMsg.set('');
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      this.errorMsg.set('JSON inválido: verifique a sintaxe.');
      return null;
    }

    const obj = this.asRecord(raw);
    if (!obj) {
      this.errorMsg.set('O JSON deve ser um objeto com "nodes" e "edges".');
      return null;
    }

    const nodes: GraphNodeInput[] = [];
    const seen = new Set<string>();
    for (const item of this.asArray(obj['nodes'])) {
      if (item === null || item === undefined) continue;
      if (typeof item === 'string') {
        if (!seen.has(item)) {
          seen.add(item);
          nodes.push({ id: item, label: item });
        }
        continue;
      }
      const no = this.asRecord(item);
      if (!no) continue;
      const id = this.firstString(no, ['id', 'key']);
      if (id === undefined || seen.has(id)) continue;
      seen.add(id);
      nodes.push({
        id,
        label: this.firstString(no, ['label', 'name', 'text']) ?? id,
        group: this.firstString(no, ['group', 'color', 'type']),
      });
    }

    const edges: GraphEdgeInput[] = [];
    for (const item of this.asArray(obj['edges'])) {
      if (item === null || item === undefined) continue;
      let from: string | undefined;
      let to: string | undefined;
      let label: string | undefined;
      if (Array.isArray(item)) {
        from = this.str(item[0]);
        to = this.str(item[1]);
      } else {
        const eo = this.asRecord(item);
        if (!eo) continue;
        from = this.firstString(eo, ['from', 'source', 'sourceId', 'u']);
        to = this.firstString(eo, ['to', 'target', 'targetId', 'v']);
        label = this.firstString(eo, ['label', 'name', 'text']);
      }
      if (from === undefined || to === undefined) continue;
      edges.push({ from, to, label });
    }

    if (nodes.length === 0 && edges.length === 0) {
      this.errorMsg.set('O JSON não contém nós nem arestas.');
      return null;
    }
    return { nodes, edges };
  }

  private asRecord(v: unknown): Record<string, unknown> | null {
    return v !== null && typeof v === 'object' && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : null;
  }

  private asArray(v: unknown): unknown[] {
    return Array.isArray(v) ? v : [];
  }

  private str(v: unknown): string | undefined {
    return v === undefined || v === null ? undefined : String(v);
  }

  private firstString(obj: Record<string, unknown>, keys: string[]): string | undefined {
    for (const k of keys) {
      const v = this.str(obj[k]);
      if (v !== undefined) return v;
    }
    return undefined;
  }

  // ── Layout em camadas ───────────────────────────────────────────────────

  private buildLayout(parsed: Parsed): void {
    const nodes = [...parsed.nodes];
    const edges = [...parsed.edges];

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
    this.nodes.set(plNodes);

    // 6) Roteamento ortogonal das arestas
    const plEdges: RoutedEdge[] = edges.map((e) => {
      const f = map.get(e.from)!;
      const t = map.get(e.to)!;
      const r = this.route(f, t);
      return { from: e.from, to: e.to, label: e.label, d: r.d, lx: r.lx, ly: r.ly };
    });
    this.edges.set(plEdges);

    // 7) Tamanho do canvas
    let maxX = 0;
    let maxY = 0;
    for (const n of plNodes) {
      maxX = Math.max(maxX, n.x + this.NODE_W);
      maxY = Math.max(maxY, n.y + this.NODE_H);
    }
    this.layers.set(ordered.map((l) => [...l]));
    this.canvasW.set(Math.max(maxX + this.PADDING, 700));
    this.canvasH.set(Math.max(maxY + this.PADDING, 400));
    this.zoom.set(1);
    this.hovered.set(null);
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

  private route(from: PlacedNode, to: PlacedNode): { d: string; lx: number; ly: number } {
    if (from.id === to.id) {
      const x = from.x + this.NODE_W / 2;
      const y = from.y;
      return {
        d: `M ${x - 16} ${y} Q ${x - 32} ${y - 40} ${x} ${y - 40} Q ${x + 32} ${y - 40} ${x + 16} ${y}`,
        lx: x,
        ly: y - 40,
      };
    }
    if (to.layer > from.layer) return this.elbow(from, to);
    return this.side(from, to);
  }

  private elbow(from: PlacedNode, to: PlacedNode): { d: string; lx: number; ly: number } {
    const sx = from.x + this.NODE_W / 2;
    const sy = from.y + this.NODE_H;
    const tx = to.x + this.NODE_W / 2;
    const ty = to.y;
    const mid = (sy + ty) / 2;
    const others = this.nodes().filter((n) => n.id !== from.id && n.id !== to.id);

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
