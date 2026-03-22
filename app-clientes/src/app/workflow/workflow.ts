import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    if (this.pathNeedsRouting(f, t, [conn.fromId, conn.toId])) {
      const lane = this.connections.filter(c => this.pathNeedsRouting(
        this.arrowFrom(c), this.arrowTo(c), [c.fromId, c.toId]
      )).indexOf(conn);
      return this.routedPath(f, t, lane);
    }
    const cpY = (f.y + t.y) / 2;
    return `M ${f.x} ${f.y} C ${f.x} ${cpY}, ${t.x} ${cpY}, ${t.x} ${t.y}`;
  }

  connectionLabelX(conn: WfConnection): number {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    if (this.pathNeedsRouting(f, t, [conn.fromId, conn.toId])) return f.x;
    return (f.x + t.x) / 2;
  }

  connectionLabelY(conn: WfConnection): number {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    if (this.pathNeedsRouting(f, t, [conn.fromId, conn.toId])) return f.y + 30;
    return (f.y + t.y) / 2 - 6;
  }

  private pathNeedsRouting(
    f: { x: number; y: number },
    t: { x: number; y: number },
    excludeIds: string[]
  ): boolean {
    const cpY = (f.y + t.y) / 2;
    const PAD = 10;
    const SAMPLES = 16;
    for (let i = 1; i < SAMPLES; i++) {
      const tt = i / SAMPLES;
      const mt = 1 - tt;
      const px = mt*mt*mt*f.x + 3*mt*mt*tt*f.x + 3*mt*tt*tt*t.x + tt*tt*tt*t.x;
      const py = mt*mt*mt*f.y + 3*mt*mt*tt*cpY + 3*mt*tt*tt*cpY + tt*tt*tt*t.y;
      for (const n of this.nodes) {
        if (excludeIds.includes(n.id)) continue;
        const nw = n.type === 'decision' ? this.DEC_W : this.NODE_W;
        const nh = n.type === 'decision' ? this.DEC_H : this.NODE_H;
        if (px > n.x - PAD && px < n.x + nw + PAD &&
            py > n.y - PAD && py < n.y + nh + PAD) {
          return true;
        }
      }
    }
    return false;
  }

  private routedPath(
    f: { x: number; y: number },
    t: { x: number; y: number },
    lane = 0
  ): string {
    const MARGIN = 64;
    const LANE_STEP = 28;
    const EXIT = 36;
    const goRight = t.y <= f.y || t.x >= f.x;
    const baseX = goRight
      ? Math.max(...this.nodes.map(n => n.x + (n.type === 'decision' ? this.DEC_W : this.NODE_W))) + MARGIN
      : Math.min(...this.nodes.map(n => n.x)) - MARGIN;
    const sideX = goRight ? baseX + lane * LANE_STEP : baseX - lane * LANE_STEP;
    return [
      `M ${f.x} ${f.y}`,
      `L ${f.x} ${f.y + EXIT}`,
      `L ${sideX} ${f.y + EXIT}`,
      `L ${sideX} ${t.y - EXIT}`,
      `L ${t.x} ${t.y - EXIT}`,
      `L ${t.x} ${t.y}`,
    ].join(' ');
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

  onNodeClick(node: WfNode, event: MouseEvent): void {
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
