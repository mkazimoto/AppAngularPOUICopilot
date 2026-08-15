import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
} from '@po-ui/ng-components';

// ── API pública do componente (padrão PO-UI: prefixo `p-`) ───────────────

/** Nó do organograma, informado pelo consumidor do componente. */
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  parentId: string | null;
  photo?: string;
}

/** Departamento com a cor usada na legenda, cards e avatares. */
export interface OrgDepartment {
  value: string;
  color: string;
}

/** Evento emitido ao salvar (adicionar ou editar) um nó. */
export interface OrgNodeSalvarEvent {
  modo: 'adicionar' | 'editar';
  node: OrgNode;
}

// ── Tipos internos ────────────────────────────────────────────────────────

interface OrgLayout {
  positions: Map<string, { x: number; y: number }>;
  width: number;
  height: number;
}

// ── Constantes ────────────────────────────────────────────────────────────

const DEFAULT_DEPARTMENTS: OrgDepartment[] = [
  { value: 'Diretoria', color: '#6366f1' },
  { value: 'Tecnologia', color: '#3b82f6' },
  { value: 'Comercial', color: '#10b981' },
  { value: 'RH', color: '#f59e0b' },
  { value: 'Financeiro', color: '#ef4444' },
  { value: 'Marketing', color: '#ec4899' },
  { value: 'Operações', color: '#8b5cf6' },
];

/**
 * Organograma hierárquico reutilizável.
 *
 * Recebe os nós via two-way binding (`[(pNodes)]`) e, opcionalmente, a lista
 * de departamentos com cores via `[pDepartamentos]` (para a legenda, os
 * cards e os avatares). O layout em árvore é calculado automaticamente de
 * forma reativa. Quando `pEditable` é `true`, permite adicionar, editar e
 * remover cargos via modal, emitindo os eventos `pSalvar` e `pExcluir`.
 */
@Component({
  selector: 'app-organograma-viewer',
  imports: [CommonModule, FormsModule, PoButtonModule, PoFieldModule, PoModalModule],
  templateUrl: './organograma-viewer.component.html',
  styleUrl: './organograma-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganogramaViewerComponent {
  // ── Inputs (padrão PO-UI: prefixo `p-`) ────────────────────────────────

  /** Nós do organograma (two-way binding com o consumidor). */
  readonly pNodes = model<OrgNode[]>([]);

  /** Habilita adicionar, editar e remover cargos. */
  readonly pEditable = input(true);

  /** Lista de departamentos com cores (fallback para uma lista padrão). */
  readonly pDepartamentos = input<OrgDepartment[]>([]);

  // ── Outputs (padrão PO-UI: prefixo `p-`) ───────────────────────────────

  /** Emitido quando um cargo é criado ou editado. */
  readonly pSalvar = output<OrgNodeSalvarEvent>();

  /** Emitido quando um cargo (e seus subordinados) é excluído. */
  readonly pExcluir = output<OrgNode>();

  // ── Constantes de layout ────────────────────────────────────────────────

  readonly NODE_W = 210;
  readonly NODE_H = 76;
  readonly H_GAP = 50;
  readonly V_GAP = 90;
  readonly PADDING = 60;

  // ── Estado local (signals) ──────────────────────────────────────────────

  readonly formName = signal('');
  readonly formRole = signal('');
  readonly formDepartment = signal('');
  readonly formPhoto = signal('');
  readonly editingNodeId = signal<string | null>(null);
  readonly addingParentId = signal<string | null>(null);

  @ViewChild('nodeModal') nodeModal!: PoModalComponent;

  readonly deptOptions = computed(() =>
    this.departments().map((d) => ({ label: d.value, value: d.value })),
  );

  readonly primaryAction: PoModalAction = { label: 'Salvar', action: () => this.saveNode() };
  readonly secondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.nodeModal?.close(),
  };

  // ── Derivados (layout reativo a partir do input) ────────────────────────

  readonly layout = computed(() => this.computeLayout(this.pNodes()));
  readonly positions = computed(() => this.layout().positions);
  readonly canvasW = computed(() => this.layout().width);
  readonly canvasH = computed(() => this.layout().height);

  readonly hasRoot = computed(() => this.pNodes().some((n) => n.parentId === null));

  readonly modalTitle = computed(() =>
    this.editingNodeId() ? 'Editar Cargo' : 'Adicionar Cargo',
  );

  /** Filhos agrupados por pai (Map<parentId, nós>) — evita O(N²) no template. */
  readonly childrenByParent = computed(() => {
    const map = new Map<string, OrgNode[]>();
    for (const n of this.pNodes()) {
      const key = n.parentId ?? '';
      const list = map.get(key);
      if (list) list.push(n);
      else map.set(key, [n]);
    }
    return map;
  });

  /** Cor por departamento (Map<value, color>) — evita `.find()` no template. */
  readonly deptColorMap = computed(() => {
    const map = new Map<string, string>();
    for (const d of this.departments()) map.set(d.value, d.color);
    return map;
  });

  /** Índice de nós por id. */
  readonly nodeById = computed(() => new Map(this.pNodes().map((n) => [n.id, n])));

  // ── Helpers públicos de template ────────────────────────────────────────

  getChildren(nodeId: string): OrgNode[] {
    return this.childrenByParent().get(nodeId) ?? [];
  }

  getNode(id: string): OrgNode | undefined {
    return this.nodeById().get(id);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  deptColor(dept: string): string {
    return this.deptColorMap().get(dept) ?? '#94a3b8';
  }

  nodePos(nodeId: string): { x: number; y: number } {
    return this.positions().get(nodeId) ?? { x: 0, y: 0 };
  }

  trackNode(_: number, n: OrgNode): string {
    return n.id;
  }

  connectionPath(parentId: string, childId: string): string {
    const p = this.nodePos(parentId);
    const c = this.nodePos(childId);
    const px = p.x + this.NODE_W / 2;
    const py = p.y + this.NODE_H;
    const cx = c.x + this.NODE_W / 2;
    const cy = c.y;
    const mid = (py + cy) / 2;
    return `M ${px} ${py} C ${px} ${mid}, ${cx} ${mid}, ${cx} ${cy}`;
  }

  // ── Ações do modal ──────────────────────────────────────────────────────

  openAddModal(parentId: string | null): void {
    const parent = parentId ? this.getNode(parentId) : null;
    this.formName.set('');
    this.formRole.set('');
    this.formDepartment.set(parent ? parent.department : (this.deptOptions()[0]?.value ?? ''));
    this.formPhoto.set('');
    this.editingNodeId.set(null);
    this.addingParentId.set(parentId);
    this.nodeModal.open();
  }

  openEditModal(node: OrgNode, event: MouseEvent): void {
    event.stopPropagation();
    this.formName.set(node.name);
    this.formRole.set(node.role);
    this.formDepartment.set(node.department);
    this.formPhoto.set(node.photo ?? '');
    this.editingNodeId.set(node.id);
    this.addingParentId.set(null);
    this.nodeModal.open();
  }

  onPhotoFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.formPhoto.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    (event.target as HTMLInputElement).value = '';
  }

  removePhoto(): void {
    this.formPhoto.set('');
  }

  saveNode(): void {
    const name = this.formName().trim();
    const role = this.formRole().trim();
    if (!name || !role) return;

    const photo = this.formPhoto() || undefined;
    const editingId = this.editingNodeId();

    if (editingId) {
      this.pNodes.update((nodes) =>
        nodes.map((n) =>
          n.id === editingId
            ? { ...n, name, role, department: this.formDepartment(), photo }
            : n,
        ),
      );
      const node = this.getNode(editingId);
      if (node) this.pSalvar.emit({ modo: 'editar', node });
    } else {
      const node: OrgNode = {
        id: 'n' + Date.now(),
        name,
        role,
        department: this.formDepartment(),
        parentId: this.addingParentId(),
        photo,
      };
      this.pNodes.update((nodes) => [...nodes, node]);
      this.pSalvar.emit({ modo: 'adicionar', node });
    }
    this.nodeModal.close();
  }

  deleteNode(nodeId: string, event: MouseEvent): void {
    event.stopPropagation();
    // Cascade-remove o nó e todos os seus descendentes
    const toRemove = new Set<string>();
    const queue = [nodeId];
    while (queue.length) {
      const id = queue.shift()!;
      toRemove.add(id);
      this.getChildren(id).forEach((c) => queue.push(c.id));
    }
    const removed = this.getNode(nodeId);
    this.pNodes.update((nodes) => nodes.filter((n) => !toRemove.has(n.id)));
    if (removed) this.pExcluir.emit(removed);
  }

  clearAll(): void {
    this.pNodes.set([]);
  }

  // ── Layout (função pura, sem estado do componente) ─────────────────────

  private computeLayout(nodes: OrgNode[]): OrgLayout {
    const positions = new Map<string, { x: number; y: number }>();
    const subtreeWidths = new Map<string, number>();
    const root = nodes.find((n) => n.parentId === null);

    if (!root) {
      return { positions, width: 800, height: 400 };
    }

    const getChildren = (id: string): OrgNode[] => nodes.filter((n) => n.parentId === id);

    const computeSubtreeWidth = (id: string): number => {
      const children = getChildren(id);
      let sw: number;
      if (children.length === 0) {
        sw = this.NODE_W;
      } else {
        const total =
          children.reduce((sum, c) => sum + computeSubtreeWidth(c.id) + this.H_GAP, 0) -
          this.H_GAP;
        sw = Math.max(this.NODE_W, total);
      }
      subtreeWidths.set(id, sw);
      return sw;
    };

    const placeNode = (id: string, leftX: number, depth: number): void => {
      const sw = subtreeWidths.get(id) ?? this.NODE_W;
      positions.set(id, {
        x: leftX + (sw - this.NODE_W) / 2,
        y: depth * (this.NODE_H + this.V_GAP) + this.PADDING,
      });
      let curX = leftX;
      for (const child of getChildren(id)) {
        placeNode(child.id, curX, depth + 1);
        curX += (subtreeWidths.get(child.id) ?? this.NODE_W) + this.H_GAP;
      }
    };

    computeSubtreeWidth(root.id);
    placeNode(root.id, this.PADDING, 0);

    let maxX = 0;
    let maxY = 0;
    for (const pos of positions.values()) {
      maxX = Math.max(maxX, pos.x + this.NODE_W);
      maxY = Math.max(maxY, pos.y + this.NODE_H);
    }

    return {
      positions,
      width: Math.max(maxX + this.PADDING, 800),
      height: Math.max(maxY + this.PADDING, 400),
    };
  }

  // ── Internos ────────────────────────────────────────────────────────────

  private departments(): OrgDepartment[] {
    return this.pDepartamentos().length ? this.pDepartamentos() : DEFAULT_DEPARTMENTS;
  }
}
