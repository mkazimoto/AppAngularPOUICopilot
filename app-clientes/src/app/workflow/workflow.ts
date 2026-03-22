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
    return { x: to.x + this.nodeWidth(to) / 2, y: to.y };
  }

  connectionPath(conn: WfConnection): string {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    const cpY = (f.y + t.y) / 2;
    return `M ${f.x} ${f.y} C ${f.x} ${cpY}, ${t.x} ${cpY}, ${t.x} ${t.y}`;
  }

  connectionLabelX(conn: WfConnection): number {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    return (f.x + t.x) / 2;
  }

  connectionLabelY(conn: WfConnection): number {
    const f = this.arrowFrom(conn);
    const t = this.arrowTo(conn);
    return (f.y + t.y) / 2 - 6;
  }

  // ── Actions ────────────────────────────────────────

  showMenu(event: MouseEvent, nodeId: string, branch?: string): void {
    event.stopPropagation();
    const key = branch ? `${nodeId}-${branch}` : nodeId;
    this.activeMenu = this.activeMenu === key ? null : key;
  }

  closeMenus(): void {
    this.activeMenu = null;
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
