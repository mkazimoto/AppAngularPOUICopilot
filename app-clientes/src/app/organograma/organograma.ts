import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
} from '@po-ui/ng-components';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  parentId: string | null;
  photo?: string;
}

const DEPT_COLORS: Record<string, string> = {
  'Diretoria':  '#6366f1',
  'Tecnologia': '#3b82f6',
  'Comercial':  '#10b981',
  'RH':         '#f59e0b',
  'Financeiro': '#ef4444',
  'Marketing':  '#ec4899',
  'Operações':  '#8b5cf6',
};

const DEPARTMENTS = Object.keys(DEPT_COLORS);

@Component({
  selector: 'app-organograma',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoFieldModule, PoModalModule, PoPageModule],
  templateUrl: './organograma.html',
  styleUrl: './organograma.css',
})
export class Organograma implements OnInit {
  // ── Layout constants ────────────────────────────────────────────────
  readonly NODE_W = 210;
  readonly NODE_H = 76;
  readonly H_GAP  = 50;
  readonly V_GAP  = 90;
  readonly PADDING = 60;

  // ── Data ────────────────────────────────────────────────────────────
  nodes: OrgNode[] = [
    { id: 'n1', name: 'João Silva',      role: 'CEO',            department: 'Diretoria',  parentId: null, photo: 'https://i.pravatar.cc/80?img=11' },
    { id: 'n2', name: 'Maria Santos',    role: 'CTO',            department: 'Tecnologia', parentId: 'n1', photo: 'https://i.pravatar.cc/80?img=5'  },
    { id: 'n3', name: 'Carlos Oliveira', role: 'CFO',            department: 'Financeiro', parentId: 'n1', photo: 'https://i.pravatar.cc/80?img=15' },
    { id: 'n4', name: 'Ana Costa',       role: 'Dev Lead',       department: 'Tecnologia', parentId: 'n2', photo: 'https://i.pravatar.cc/80?img=47' },
    { id: 'n5', name: 'Pedro Lima',      role: 'Dev Sênior',     department: 'Tecnologia', parentId: 'n4', photo: 'https://i.pravatar.cc/80?img=53' },
    { id: 'n6', name: 'Lucia Ferreira',  role: 'Ger. de RH',     department: 'RH',         parentId: 'n3', photo: 'https://i.pravatar.cc/80?img=9'  },
    { id: 'n7', name: 'Roberto Almeida', role: 'Ger. Comercial',  department: 'Comercial',  parentId: 'n3', photo: 'https://i.pravatar.cc/80?img=33' },
  ];

  // ── Layout state ────────────────────────────────────────────────────
  positions     = new Map<string, { x: number; y: number }>();
  subtreeWidths = new Map<string, number>();
  canvasW = 1200;
  canvasH = 600;

  // ── Form state ──────────────────────────────────────────────────────
  formName       = '';
  formRole       = '';
  formDepartment = DEPARTMENTS[0];
  formPhoto      = '';
  editingNodeId:  string | null = null;
  addingParentId: string | null = null;

  readonly deptOptions = DEPARTMENTS.map(d => ({ label: d, value: d }));

  @ViewChild('nodeModal') nodeModal!: PoModalComponent;

  primaryAction:   PoModalAction = { label: 'Salvar',   action: () => this.saveNode()        };
  secondaryAction: PoModalAction = { label: 'Cancelar', action: () => this.nodeModal.close() };

  ngOnInit(): void {
    this.layoutTree();
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  getChildren(nodeId: string): OrgNode[] {
    return this.nodes.filter(n => n.parentId === nodeId);
  }

  getRootNode(): OrgNode | undefined {
    return this.nodes.find(n => n.parentId === null);
  }

  getNode(id: string): OrgNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getColor(dept: string): string {
    return DEPT_COLORS[dept] ?? '#94a3b8';
  }

  nodePos(nodeId: string): { x: number; y: number } {
    return this.positions.get(nodeId) ?? { x: 0, y: 0 };
  }

  trackNode(_: number, n: OrgNode): string { return n.id; }

  get hasRoot(): boolean { return !!this.getRootNode(); }

  get modalTitle(): string {
    return this.editingNodeId ? 'Editar Cargo' : 'Adicionar Cargo';
  }

  // ── Tree layout ──────────────────────────────────────────────────────

  private computeSubtreeWidth(nodeId: string): number {
    const children = this.getChildren(nodeId);
    let sw: number;
    if (children.length === 0) {
      sw = this.NODE_W;
    } else {
      const total =
        children.reduce((sum, c) => sum + this.computeSubtreeWidth(c.id) + this.H_GAP, 0)
        - this.H_GAP;
      sw = Math.max(this.NODE_W, total);
    }
    this.subtreeWidths.set(nodeId, sw);
    return sw;
  }

  private placeNode(nodeId: string, leftX: number, depth: number): void {
    const sw = this.subtreeWidths.get(nodeId) ?? this.NODE_W;
    this.positions.set(nodeId, {
      x: leftX + (sw - this.NODE_W) / 2,
      y: depth * (this.NODE_H + this.V_GAP) + this.PADDING,
    });
    let curX = leftX;
    for (const child of this.getChildren(nodeId)) {
      this.placeNode(child.id, curX, depth + 1);
      curX += (this.subtreeWidths.get(child.id) ?? this.NODE_W) + this.H_GAP;
    }
  }

  layoutTree(): void {
    this.subtreeWidths.clear();
    this.positions.clear();
    const root = this.getRootNode();
    if (!root) return;
    this.computeSubtreeWidth(root.id);
    this.placeNode(root.id, this.PADDING, 0);
    let maxX = 0, maxY = 0;
    for (const pos of this.positions.values()) {
      maxX = Math.max(maxX, pos.x + this.NODE_W);
      maxY = Math.max(maxY, pos.y + this.NODE_H);
    }
    this.canvasW = Math.max(maxX + this.PADDING, 800);
    this.canvasH = Math.max(maxY + this.PADDING, 400);
  }

  // ── SVG connection paths ─────────────────────────────────────────────

  connectionPath(parentId: string, childId: string): string {
    const p   = this.nodePos(parentId);
    const c   = this.nodePos(childId);
    const px  = p.x + this.NODE_W / 2;
    const py  = p.y + this.NODE_H;
    const cx  = c.x + this.NODE_W / 2;
    const cy  = c.y;
    const mid = (py + cy) / 2;
    return `M ${px} ${py} C ${px} ${mid}, ${cx} ${mid}, ${cx} ${cy}`;
  }

  // ── Modal actions ────────────────────────────────────────────────────

  openAddModal(parentId: string | null): void {
    const parent = parentId ? this.getNode(parentId) : null;
    this.formName       = '';
    this.formRole       = '';
    this.formDepartment = parent ? parent.department : DEPARTMENTS[0];
    this.formPhoto      = '';
    this.editingNodeId  = null;
    this.addingParentId = parentId;
    this.nodeModal.open();
  }

  openEditModal(node: OrgNode, event: MouseEvent): void {
    event.stopPropagation();
    this.formName       = node.name;
    this.formRole       = node.role;
    this.formDepartment = node.department;
    this.formPhoto      = node.photo ?? '';
    this.editingNodeId  = node.id;
    this.addingParentId = null;
    this.nodeModal.open();
  }

  onPhotoFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.formPhoto = reader.result as string; };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    (event.target as HTMLInputElement).value = '';
  }

  removePhoto(): void {
    this.formPhoto = '';
  }

  saveNode(): void {
    if (!this.formName.trim() || !this.formRole.trim()) return;
    if (this.editingNodeId) {
      const node = this.getNode(this.editingNodeId);
      if (node) {
        node.name       = this.formName.trim();
        node.role       = this.formRole.trim();
        node.department = this.formDepartment;
        node.photo      = this.formPhoto || undefined;
      }
    } else {
      this.nodes.push({
        id:         'n' + Date.now(),
        name:       this.formName.trim(),
        role:       this.formRole.trim(),
        department: this.formDepartment,
        parentId:   this.addingParentId,
        photo:      this.formPhoto || undefined,
      });
    }
    this.layoutTree();
    this.nodeModal.close();
  }

  deleteNode(nodeId: string, event: MouseEvent): void {
    event.stopPropagation();
    // Cascade-remove the node and all its descendants
    const toRemove = new Set<string>();
    const queue    = [nodeId];
    while (queue.length) {
      const id = queue.shift()!;
      toRemove.add(id);
      this.getChildren(id).forEach(c => queue.push(c.id));
    }
    this.nodes = this.nodes.filter(n => !toRemove.has(n.id));
    this.layoutTree();
  }

  clearAll(): void {
    this.nodes = [];
    this.positions.clear();
    this.subtreeWidths.clear();
    this.canvasW = 800;
    this.canvasH = 400;
  }
}
