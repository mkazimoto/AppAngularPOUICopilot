import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
} from '@po-ui/ng-components';

export type NodeType = 'start' | 'end' | 'action' | 'decision';

export interface WfNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
}

export interface WfConnection {
  fromId: string;
  toId: string;
  branch?: string; // 'Sim' | 'Não' for decision
}

interface WfRoute {
  path: string;
  lx: number;
  ly: number;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoFieldModule, PoModalModule, PoPageModule],
  templateUrl: './workflow.html',
  styleUrl: './workflow.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Workflow implements OnInit {
  // ── Persistence ────────────────────────────────────
  private readonly STORAGE_KEY = 'wf-editor-state';

  // ── Constants ──────────────────────────────────────
  readonly NODE_W = 180;
  readonly NODE_H = 60;
  readonly DEC_W = 180;
  readonly DEC_H = 120;
  readonly V_GAP = 120;   // vertical gap between parent bottom and child top
  readonly H_OFFSET = 200; // horizontal shift for decision branches
  readonly CANVAS_W = 2400;
  readonly CANVAS_H = 1800;
  readonly INIT_X = 1110; // start node x (center at 1200)
  readonly INIT_Y = 40;

  // Diamond geometry (80×80 square rotated 45°, centered at node (90,60)):
  // corner-to-center = √(40²+40²) ≈ 56.57
  // Left point  : (90 - 56.57, 60) ≈ (33, 60)
  // Right point : (90 + 56.57, 60) ≈ (147, 60)
  // Bottom point: (90, 60 + 56.57) ≈ (90, 117)

  // ── State (signals) ────────────────────────────────
  readonly nodes = signal<WfNode[]>([
    { id: 'start-0', type: 'start', label: 'Início', x: this.INIT_X, y: this.INIT_Y },
  ]);
  readonly connections = signal<WfConnection[]>([]);

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const { nodes, connections } = JSON.parse(raw) as { nodes: WfNode[]; connections: WfConnection[] };
        if (Array.isArray(nodes) && nodes.length) {
          this.nodes.set(nodes);
          this.connections.set(Array.isArray(connections) ? connections : []);
        }
      }
    } catch {
      // corrupted data — keep defaults
    }

    this.centerStartNode();
  }

  private saveState(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({ nodes: this.nodes(), connections: this.connections() }),
    );
  }

  // ── UI state (signals) ─────────────────────────────
  readonly activeMenu = signal<string | null>(null);
  readonly selectedNode = signal<WfNode | null>(null);
  readonly editingLabel = signal('');
  readonly connectingFromId = signal<string | null>(null);
  readonly connectingBranch = signal<string | undefined>(undefined);

  // ── Zoom ───────────────────────────────────────────
  readonly zoomLevel = signal(1);
  readonly zoomPercent = computed(() => Math.round(this.zoomLevel() * 100));
  readonly ZOOM_MIN = 0.3;
  readonly ZOOM_MAX = 2;
  readonly ZOOM_STEP = 0.15;

  // ── Drag state (não-reativo; aplicado via DOM durante o gesto) ──
  readonly draggingNodeId = signal<string | null>(null);
  private dragNode: WfNode | null = null;
  private dragEl: HTMLElement | null = null;
  private dragStartPageX = 0;
  private dragStartPageY = 0;
  private dragNodeOrigX = 0;
  private dragNodeOrigY = 0;
  private dragMoved = false;

  private readonly ngZone = inject(NgZone);

  @ViewChild('editModal') editModal!: PoModalComponent;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  primaryAction: PoModalAction = {
    label: 'Salvar',
    action: () => this.saveEdit(),
  };

  secondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.editModal.close(),
  };

  // ── Helpers ────────────────────────────────────────

  nodeWidth(node: WfNode): number {
    return node.type === 'decision' ? this.DEC_W : this.NODE_W;
  }

  nodeHeight(node: WfNode): number {
    return node.type === 'decision' ? this.DEC_H : this.NODE_H;
  }

  trackNode(_i: number, n: WfNode): string { return n.id; }
  trackConn(_i: number, c: WfConnection): string { return c.fromId + '>' + c.toId; }

  getNode(id: string): WfNode | undefined {
    return this.nodes().find(n => n.id === id);
  }

  hasConnection(nodeId: string, branch?: string): boolean {
    return this.connections().some(c => c.fromId === nodeId && c.branch === branch);
  }

  isMenuOpen(nodeId: string, branch?: string): boolean {
    return this.activeMenu() === (branch ? `${nodeId}-${branch}` : nodeId);
  }

  // ── SVG Paths ──────────────────────────────────────

  arrowFrom(conn: WfConnection): { x: number; y: number } {
    const from = this.getNode(conn.fromId);
    if (!from) return { x: 0, y: 0 };
    if (from.type === 'decision') {
      if (conn.branch === 'Sim') return { x: from.x + 33, y: from.y + 60 };
      if (conn.branch === 'Não') return { x: from.x + 147, y: from.y + 60 };
      return { x: from.x + 90, y: from.y + 117 };
    }
    return { x: from.x + this.NODE_W / 2, y: from.y + this.NODE_H };
  }

  arrowTo(conn: WfConnection): { x: number; y: number } {
    const to = this.getNode(conn.toId);
    if (!to) return { x: 0, y: 0 };
    const siblings = this.connections().filter(c => c.toId === conn.toId);
    const idx = siblings.indexOf(conn);
    const offset = siblings.length > 1 ? (idx - (siblings.length - 1) / 2) * 22 : 0;
    return { x: to.x + this.nodeWidth(to) / 2 + offset, y: to.y };
  }

  /** Rota ortogonal por conexão (recalculada uma única vez por mudança de dados). */
  readonly routes = computed(() => {
    const map = new Map<string, WfRoute>();
    for (const c of this.connections()) {
      map.set(this.connKey(c), this.buildRoute(c));
    }
    return map;
  });

  connKey(conn: WfConnection): string {
    return conn.fromId + '>' + conn.toId + (conn.branch ? '|' + conn.branch : '');
  }

  // ── Orthogonal router ──────────────────────────────

  private readonly ROUTE_PAD = 14;

  /** True if horizontal segment at y between x1..x2 is clear of obstacles. */
  private segH(y: number, x1: number, x2: number, excl: string[]): boolean {
    const xL = Math.min(x1, x2);
    const xR = Math.max(x1, x2);
    return !this.nodes().some(n => {
      if (excl.includes(n.id)) return false;
      const p = this.ROUTE_PAD;
      return xR > n.x - p && xL < n.x + this.nodeWidth(n) + p &&
             y  > n.y - p && y  < n.y + this.nodeHeight(n) + p;
    });
  }

  /** True if vertical segment at x between y1..y2 is clear of obstacles. */
  private segV(x: number, y1: number, y2: number, excl: string[]): boolean {
    const yT = Math.min(y1, y2);
    const yB = Math.max(y1, y2);
    return !this.nodes().some(n => {
      if (excl.includes(n.id)) return false;
      const p = this.ROUTE_PAD;
      return x  > n.x - p && x  < n.x + this.nodeWidth(n) + p &&
             yB > n.y - p && yT < n.y + this.nodeHeight(n) + p;
    });
  }

  private buildRoute(conn: WfConnection): { path: string; lx: number; ly: number } {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    const excl = [conn.fromId, conn.toId];
    const obstacles = this.nodes().filter(n => !excl.includes(n.id));

    // Candidate Y levels: midpoint + gaps around every obstacle
    const midY = (f.y + t.y) / 2;
    const ys = new Set<number>([midY]);
    for (const n of obstacles) {
      ys.add(n.y - this.ROUTE_PAD * 2);
      ys.add(n.y + this.nodeHeight(n) + this.ROUTE_PAD * 2);
    }
    // Sort ascending by distance from midY so we try the shortest path first
    const sorted = [...ys].sort((a, b) => Math.abs(a - midY) - Math.abs(b - midY));

    // Try 3-segment elbow: down to elbowY → horizontal → down to t
    for (const ey of sorted) {
      if (this.segV(f.x, f.y, ey, excl) &&
          this.segH(ey, f.x, t.x, excl) &&
          this.segV(t.x, ey, t.y, excl)) {
        return {
          path: `M ${f.x} ${f.y} L ${f.x} ${ey} L ${t.x} ${ey} L ${t.x} ${t.y}`,
          lx: (f.x + t.x) / 2,
          ly: ey,
        };
      }
    }

    // 5-segment side detour: exit down → go to clear side lane → enter from side
    const EXIT = 32;
    const LANE = 28;
    const laneIdx = this.connections().indexOf(conn);
    const goRight = t.x >= f.x;
    const sideBase = obstacles.length > 0
      ? (goRight
          ? Math.max(...obstacles.map(n => n.x + this.nodeWidth(n))) + 50
          : Math.min(...obstacles.map(n => n.x)) - 50)
      : (goRight ? Math.max(f.x, t.x) + 80 : Math.min(f.x, t.x) - 80);
    const sideX = goRight
      ? sideBase + laneIdx * LANE
      : sideBase - laneIdx * LANE;

    return {
      path: [
        `M ${f.x} ${f.y}`,
        `L ${f.x} ${f.y + EXIT}`,
        `L ${sideX} ${f.y + EXIT}`,
        `L ${sideX} ${t.y - EXIT}`,
        `L ${t.x} ${t.y - EXIT}`,
        `L ${t.x} ${t.y}`,
      ].join(' '),
      lx: sideX,
      ly: (f.y + t.y) / 2,
    };
  }

  // ── Actions ────────────────────────────────────────

  showMenu(event: MouseEvent, nodeId: string, branch?: string): void {
    event.stopPropagation();
    const key = branch ? `${nodeId}-${branch}` : nodeId;
    this.activeMenu.set(this.activeMenu() === key ? null : key);
  }

  closeMenus(): void {
    this.activeMenu.set(null);
    this.cancelConnect();
  }

  hasConnectableTargets(fromNode: WfNode, branch?: string): boolean {
    return this.nodes().some(n => {
      if (n.id === fromNode.id) return false;
      return !this.connections().some(
        c => c.fromId === fromNode.id && c.toId === n.id && c.branch === branch
      );
    });
  }

  isConnectableTarget(node: WfNode): boolean {
    const fromId = this.connectingFromId();
    if (!fromId) return false;
    if (node.id === fromId) return false;
    return !this.connections().some(
      c => c.fromId === fromId && c.toId === node.id && c.branch === this.connectingBranch()
    );
  }

  startConnectExisting(fromNode: WfNode, branch?: string): void {
    this.connectingFromId.set(fromNode.id);
    this.connectingBranch.set(branch);
    this.activeMenu.set(null);
  }

  connectToExisting(targetNode: WfNode): void {
    const fromId = this.connectingFromId();
    if (!fromId || !this.isConnectableTarget(targetNode)) return;
    this.connections.update(list => [
      ...list,
      { fromId, toId: targetNode.id, branch: this.connectingBranch() },
    ]);
    this.connectingFromId.set(null);
    this.connectingBranch.set(undefined);
    this.saveState();
  }

  cancelConnect(): void {
    this.connectingFromId.set(null);
    this.connectingBranch.set(undefined);
  }

  onNodeMouseDown(event: MouseEvent, node: WfNode): void {
    if (this.connectingFromId()) return;
    if ((event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragNode = node;
    this.dragEl = (event.currentTarget as HTMLElement) ?? null;
    this.dragStartPageX = event.clientX;
    this.dragStartPageY = event.clientY;
    this.dragNodeOrigX = node.x;
    this.dragNodeOrigY = node.y;
    this.draggingNodeId.set(node.id);
    this.dragMoved = false;
    // Listeners nativos fora do zone.js: sem CD por frame durante o arrasto.
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onDragMove);
      document.addEventListener('mouseup', this.onDragUp);
    });
  }

  private onDragMove = (event: MouseEvent): void => {
    if (!this.dragNode) return;
    const dx = event.clientX - this.dragStartPageX;
    const dy = event.clientY - this.dragStartPageY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragMoved = true;
    const x = Math.max(0, Math.min(this.CANVAS_W - this.nodeWidth(this.dragNode), this.dragNodeOrigX + dx));
    const y = Math.max(0, Math.min(this.CANVAS_H - this.nodeHeight(this.dragNode), this.dragNodeOrigY + dy));
    this.dragNode.x = x;
    this.dragNode.y = y;
    // Aplica a posição direto no DOM (sem recálculo de rotas por frame).
    if (this.dragEl) {
      this.dragEl.style.left = `${x}px`;
      this.dragEl.style.top = `${y}px`;
    }
  };

  private onDragUp = (): void => {
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragUp);
    const moved = this.dragNode;
    this.dragNode = null;
    this.dragEl = null;
    this.draggingNodeId.set(null);
    if (moved && this.dragMoved) {
      // Commit no modelo → rotas recalculadas uma única vez.
      this.nodes.update(list => list.map(n => (n.id === moved.id ? { ...moved } : n)));
      this.saveState();
    }
  };

  onNodeClick(node: WfNode, event: MouseEvent): void {
    if (this.dragMoved) {
      this.dragMoved = false;
      return;
    }
    if (this.connectingFromId()) {
      event.stopPropagation();
      this.connectToExisting(node);
    }
  }

  addNode(fromNode: WfNode, type: NodeType, branch?: string): void {
    const id = `${type}-${Date.now()}`;
    const labels: Record<NodeType, string> = {
      start: 'Início', end: 'Fim', action: 'Nova Ação', decision: 'Nova Decisão',
    };

    let x = fromNode.x;
    let y = fromNode.y + this.nodeHeight(fromNode) + this.V_GAP;

    if (branch === 'Sim') {
      x = fromNode.x - this.H_OFFSET;
      y = fromNode.y + this.DEC_H + this.V_GAP;
    } else if (branch === 'Não') {
      x = fromNode.x + this.H_OFFSET;
      y = fromNode.y + this.DEC_H + this.V_GAP;
    }

    ({ x, y } = this.findFreePosition(x, y, type));

    this.nodes.update(list => [...list, { id, type, label: labels[type], x, y }]);
    this.connections.update(list => [...list, { fromId: fromNode.id, toId: id, branch }]);
    this.activeMenu.set(null);
    this.saveState();
  }

  openEdit(node: WfNode): void {
    this.selectedNode.set(node);
    this.editingLabel.set(node.label);
    this.editModal.open();
  }

  saveEdit(): void {
    const selected = this.selectedNode();
    if (selected) {
      this.nodes.update(list =>
        list.map(n => (n.id === selected.id ? { ...n, label: this.editingLabel() } : n)),
      );
      this.saveState();
    }
    this.editModal.close();
  }

  deleteNode(nodeId: string): void {
    if (nodeId === 'start-0') return;
    const toDelete = new Set<string>();
    this.collectDescendants(nodeId, toDelete);
    toDelete.add(nodeId);
    this.nodes.update(list => list.filter(n => !toDelete.has(n.id)));
    this.connections.update(list => list.filter(c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)));
    this.saveState();
  }

  private overlapsAny(x: number, y: number, type: NodeType): boolean {
    const MARGIN = 20;
    const w = type === 'decision' ? this.DEC_W : this.NODE_W;
    const h = type === 'decision' ? this.DEC_H : this.NODE_H;
    return this.nodes().some(n => {
      const nw = n.type === 'decision' ? this.DEC_W : this.NODE_W;
      const nh = n.type === 'decision' ? this.DEC_H : this.NODE_H;
      return (
        x < n.x + nw + MARGIN &&
        x + w + MARGIN > n.x &&
        y < n.y + nh + MARGIN &&
        y + h + MARGIN > n.y
      );
    });
  }

  private findFreePosition(x: number, y: number, type: NodeType): { x: number; y: number } {
    if (!this.overlapsAny(x, y, type)) return { x, y };
    const MARGIN = 20;
    const step = (type === 'decision' ? this.DEC_W : this.NODE_W) + MARGIN;
    for (let i = 1; i <= 30; i++) {
      if (!this.overlapsAny(x + i * step, y, type)) return { x: x + i * step, y };
      if (!this.overlapsAny(x - i * step, y, type)) return { x: x - i * step, y };
    }
    // fallback: push down
    const yStep = (type === 'decision' ? this.DEC_H : this.NODE_H) + MARGIN;
    return { x, y: y + yStep };
  }

  private collectDescendants(nodeId: string, acc: Set<string>): void {
    for (const c of this.connections()) {
      if (c.fromId === nodeId && !acc.has(c.toId)) {
        acc.add(c.toId);
        this.collectDescendants(c.toId, acc);
      }
    }
  }

  clearWorkflow(): void {
    this.nodes.set([{ id: 'start-0', type: 'start', label: 'Início', x: this.INIT_X, y: this.INIT_Y }]);
    this.connections.set([]);
    this.activeMenu.set(null);
    this.saveState();
  }

  zoomIn(): void {
    this.zoomLevel.update(z => Math.min(this.ZOOM_MAX, +(z + this.ZOOM_STEP).toFixed(2)));
  }

  zoomOut(): void {
    this.zoomLevel.update(z => Math.max(this.ZOOM_MIN, +(z - this.ZOOM_STEP).toFixed(2)));
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
  }

  centerStartNode(): void {
    const start = this.nodes().find(n => n.type === 'start');
    if (!start || !this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    const nodeCX = (start.x + this.NODE_W / 2) * this.zoomLevel();
    const nodeCY = (start.y + this.NODE_H / 2) * this.zoomLevel();
    el.scrollLeft = nodeCX - el.clientWidth / 2;
    el.scrollTop = nodeCY - el.clientHeight / 2;
  }
}
