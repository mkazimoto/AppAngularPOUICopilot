import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoFieldModule, PoModalModule, PoPageModule],
  templateUrl: './workflow.html',
  styleUrl: './workflow.css',
})
export class Workflow {
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

  // ── State ──────────────────────────────────────────
  nodes: WfNode[] = [
    { id: 'start-0', type: 'start', label: 'Início', x: this.INIT_X, y: this.INIT_Y },
  ];
  connections: WfConnection[] = [];
  activeMenu: string | null = null;
  selectedNode: WfNode | null = null;
  editingLabel = '';
  connectingFromId: string | null = null;
  connectingBranch: string | undefined = undefined;

  // ── Drag state ─────────────────────────────────────
  draggingNodeId: string | null = null;
  private dragNode: WfNode | null = null;
  private dragStartPageX = 0;
  private dragStartPageY = 0;
  private dragNodeOrigX = 0;
  private dragNodeOrigY = 0;
  private dragMoved = false;

  @ViewChild('editModal') editModal!: PoModalComponent;

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
    return this.nodes.find(n => n.id === id);
  }

  hasConnection(nodeId: string, branch?: string): boolean {
    return this.connections.some(c => c.fromId === nodeId && c.branch === branch);
  }

  isMenuOpen(nodeId: string, branch?: string): boolean {
    return this.activeMenu === (branch ? `${nodeId}-${branch}` : nodeId);
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
    const siblings = this.connections.filter(c => c.toId === conn.toId);
    const idx = siblings.indexOf(conn);
    const offset = siblings.length > 1 ? (idx - (siblings.length - 1) / 2) * 22 : 0;
    return { x: to.x + this.nodeWidth(to) / 2 + offset, y: to.y };
  }

  connectionPath(conn: WfConnection): string {
    return this.buildRoute(conn).path;
  }

  connectionLabelX(conn: WfConnection): number {
    return this.buildRoute(conn).lx;
  }

  connectionLabelY(conn: WfConnection): number {
    return this.buildRoute(conn).ly - 6;
  }

  // ── Orthogonal router ──────────────────────────────

  private readonly ROUTE_PAD = 14;

  /** True if horizontal segment at y between x1..x2 is clear of obstacles. */
  private segH(y: number, x1: number, x2: number, excl: string[]): boolean {
    const xL = Math.min(x1, x2);
    const xR = Math.max(x1, x2);
    return !this.nodes.some(n => {
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
    return !this.nodes.some(n => {
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
    const obstacles = this.nodes.filter(n => !excl.includes(n.id));

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
    const laneIdx = this.connections.indexOf(conn);
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
    this.activeMenu = this.activeMenu === key ? null : key;
  }

  closeMenus(): void {
    this.activeMenu = null;
    this.cancelConnect();
  }

  hasConnectableTargets(fromNode: WfNode, branch?: string): boolean {
    return this.nodes.some(n => {
      if (n.id === fromNode.id) return false;
      return !this.connections.some(
        c => c.fromId === fromNode.id && c.toId === n.id && c.branch === branch
      );
    });
  }

  isConnectableTarget(node: WfNode): boolean {
    if (!this.connectingFromId) return false;
    if (node.id === this.connectingFromId) return false;
    return !this.connections.some(
      c => c.fromId === this.connectingFromId && c.toId === node.id && c.branch === this.connectingBranch
    );
  }

  startConnectExisting(fromNode: WfNode, branch?: string): void {
    this.connectingFromId = fromNode.id;
    this.connectingBranch = branch;
    this.activeMenu = null;
  }

  connectToExisting(targetNode: WfNode): void {
    if (!this.connectingFromId || !this.isConnectableTarget(targetNode)) return;
    this.connections = [...this.connections, {
      fromId: this.connectingFromId,
      toId: targetNode.id,
      branch: this.connectingBranch,
    }];
    this.connectingFromId = null;
    this.connectingBranch = undefined;
  }

  cancelConnect(): void {
    this.connectingFromId = null;
    this.connectingBranch = undefined;
  }

  onNodeMouseDown(event: MouseEvent, node: WfNode): void {
    if (this.connectingFromId) return;
    if ((event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragNode = node;
    this.dragStartPageX = event.clientX;
    this.dragStartPageY = event.clientY;
    this.dragNodeOrigX = node.x;
    this.dragNodeOrigY = node.y;
    this.draggingNodeId = node.id;
    this.dragMoved = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.dragNode) return;
    const dx = event.clientX - this.dragStartPageX;
    const dy = event.clientY - this.dragStartPageY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragMoved = true;
    this.dragNode.x = Math.max(0, Math.min(this.CANVAS_W - this.nodeWidth(this.dragNode), this.dragNodeOrigX + dx));
    this.dragNode.y = Math.max(0, Math.min(this.CANVAS_H - this.nodeHeight(this.dragNode), this.dragNodeOrigY + dy));
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.dragNode = null;
    this.draggingNodeId = null;
  }

  onNodeClick(node: WfNode, event: MouseEvent): void {
    if (this.dragMoved) {
      this.dragMoved = false;
      return;
    }
    if (this.connectingFromId) {
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

    this.nodes = [...this.nodes, { id, type, label: labels[type], x, y }];
    this.connections = [...this.connections, { fromId: fromNode.id, toId: id, branch }];
    this.activeMenu = null;
  }

  openEdit(node: WfNode): void {
    this.selectedNode = node;
    this.editingLabel = node.label;
    this.editModal.open();
  }

  saveEdit(): void {
    if (this.selectedNode) {
      this.nodes = this.nodes.map(n =>
        n.id === this.selectedNode!.id ? { ...n, label: this.editingLabel } : n
      );
    }
    this.editModal.close();
  }

  deleteNode(nodeId: string): void {
    if (nodeId === 'start-0') return;
    const toDelete = new Set<string>();
    this.collectDescendants(nodeId, toDelete);
    toDelete.add(nodeId);
    this.nodes = this.nodes.filter(n => !toDelete.has(n.id));
    this.connections = this.connections.filter(
      c => !toDelete.has(c.fromId) && !toDelete.has(c.toId)
    );
  }

  private overlapsAny(x: number, y: number, type: NodeType): boolean {
    const MARGIN = 20;
    const w = type === 'decision' ? this.DEC_W : this.NODE_W;
    const h = type === 'decision' ? this.DEC_H : this.NODE_H;
    return this.nodes.some(n => {
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
    for (const c of this.connections) {
      if (c.fromId === nodeId && !acc.has(c.toId)) {
        acc.add(c.toId);
        this.collectDescendants(c.toId, acc);
      }
    }
  }

  clearWorkflow(): void {
    this.nodes = [{ id: 'start-0', type: 'start', label: 'Início', x: this.INIT_X, y: this.INIT_Y }];
    this.connections = [];
    this.activeMenu = null;
  }
}
