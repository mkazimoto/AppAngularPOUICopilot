import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTagModule,
  PoTagType,
} from '@po-ui/ng-components';

export type NodeStatus = 'ativo' | 'inativo' | 'pendente';

export interface TreeNode {
  id: string;
  label: string;
  category: string;
  responsible: string;
  status: NodeStatus;
  parentId: string | null;
  expanded: boolean;
}

export interface FlatNode extends TreeNode {
  level: number;
  hasChildren: boolean;
}

const SENTINEL_ID = '__new__';

// â”€â”€ EAP generation constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FASES = [
  'IniciaÃ§Ã£o', 'Planejamento', 'Requisitos', 'Arquitetura', 'Desenvolvimento',
  'Testes', 'IntegraÃ§Ã£o', 'ImplantaÃ§Ã£o', 'Treinamento', 'Encerramento',
];

const ENTREGAVEIS = [
  'Escopo', 'Cronograma', 'OrÃ§amento', 'Riscos', 'Qualidade',
  'Recursos', 'ComunicaÃ§Ã£o', 'Contratos', 'Stakeholders', 'MudanÃ§as',
];

const PACOTES = [
  'DefiniÃ§Ã£o', 'AnÃ¡lise', 'Design', 'ImplementaÃ§Ã£o', 'RevisÃ£o',
  'AprovaÃ§Ã£o', 'DocumentaÃ§Ã£o', 'ValidaÃ§Ã£o', 'PublicaÃ§Ã£o', 'Monitoramento',
];

const RESPONSAVEIS = [
  'Ana Costa', 'Bruno Lima', 'Carlos Oliveira', 'Diana Santos', 'Eduardo Ferreira',
  'Fernanda Alves', 'Gabriel Ramos', 'Helena Souza', 'Igor Martins', 'Julia Pereira',
];

const STATUSES: NodeStatus[] = ['ativo', 'ativo', 'ativo', 'pendente', 'inativo'];

function buildEapNodes(): TreeNode[] {
  const nodes: TreeNode[] = [];
  let seq = 1;

  const rootId = String(seq++);
  nodes.push({
    id: rootId,
    label: 'EAP â€” Sistema Corporativo Integrado',
    category: 'Projeto',
    responsible: 'JoÃ£o Silva',
    status: 'ativo',
    parentId: null,
    expanded: true,
  });

  // 10 fases Ã— 10 entregÃ¡veis Ã— 10 pacotes Ã— 9 atividades = 9.000 + 1.000 + 100 + 10 + 1 = 10.111
  for (let f = 0; f < FASES.length; f++) {
    const faseId = String(seq++);
    nodes.push({
      id: faseId,
      label: `${f + 1}. ${FASES[f]}`,
      category: 'Fase',
      responsible: RESPONSAVEIS[f % RESPONSAVEIS.length],
      status: STATUSES[f % STATUSES.length],
      parentId: rootId,
      expanded: false,
    });

    for (let e = 0; e < ENTREGAVEIS.length; e++) {
      const entId = String(seq++);
      nodes.push({
        id: entId,
        label: `${f + 1}.${e + 1} ${ENTREGAVEIS[e]}`,
        category: 'EntregÃ¡vel',
        responsible: RESPONSAVEIS[(f + e) % RESPONSAVEIS.length],
        status: STATUSES[(f + e) % STATUSES.length],
        parentId: faseId,
        expanded: false,
      });

      for (let p = 0; p < PACOTES.length; p++) {
        const pacId = String(seq++);
        nodes.push({
          id: pacId,
          label: `${f + 1}.${e + 1}.${p + 1} ${PACOTES[p]}`,
          category: 'Pacote de Trabalho',
          responsible: RESPONSAVEIS[(f + e + p) % RESPONSAVEIS.length],
          status: STATUSES[(f + e + p) % STATUSES.length],
          parentId: entId,
          expanded: false,
        });

        for (let a = 1; a <= 9; a++) {
          nodes.push({
            id: String(seq++),
            label: `${f + 1}.${e + 1}.${p + 1}.${a} Atividade ${a}`,
            category: 'Atividade',
            responsible: RESPONSAVEIS[(f + e + p + a) % RESPONSAVEIS.length],
            status: STATUSES[(f + e + p + a) % STATUSES.length],
            parentId: pacId,
            expanded: false,
          });
        }
      }
    }
  }

  return nodes;
}

@Component({
  selector: 'app-treeview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoButtonModule,
    PoFieldModule,
    PoPageModule,
    PoTagModule,
  ],
  templateUrl: './treeview.html',
  styleUrl: './treeview.css',
})
export class Treeview {
  readonly SENTINEL = SENTINEL_ID;

  nodes: TreeNode[] = buildEapNodes();

  // â”€â”€ Inline edit state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  editingId: string | null = null;
  editForm = { label: '', category: 'Fase', responsible: '', status: 'ativo' as NodeStatus };

  // â”€â”€ Pending add state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  pendingAdd: { parentId: string | null } | null = null;
  addForm    = { label: '', category: 'Atividade', responsible: '', status: 'ativo' as NodeStatus };

  readonly categoryOptions = [
    { label: 'Projeto',           value: 'Projeto'           },
    { label: 'Fase',              value: 'Fase'              },
    { label: 'EntregÃ¡vel',        value: 'EntregÃ¡vel'        },
    { label: 'Pacote de Trabalho',value: 'Pacote de Trabalho'},
    { label: 'Atividade',         value: 'Atividade'         },
  ];

  readonly statusOptions = [
    { label: 'Ativo',    value: 'ativo'    },
    { label: 'Inativo',  value: 'inativo'  },
    { label: 'Pendente', value: 'pendente' },
  ];

  readonly pageActions: PoPageAction[] = [
    { label: 'Adicionar Raiz', action: () => this.startAdd(null),   icon: 'an an-plus-circle' },
    { label: 'Expandir Todos', action: () => this.expandAll(),      icon: 'an an-arrows-out'  },
    { label: 'Recolher Todos', action: () => this.collapseAll(),    icon: 'an an-arrows-in'   },
  ];

  constructor(private notification: PoNotificationService) {}

  // â”€â”€ Visible flat list â€” O(n) build with map, O(visible) traversal â”€â”€
  get visibleNodes(): FlatNode[] {
    const result: FlatNode[] = [];

    // Single-pass index: parentId â†’ children list + set of node IDs that have children
    const childrenMap = new Map<string | null, TreeNode[]>();
    const hasChildrenSet = new Set<string>();

    for (const node of this.nodes) {
      const key = node.parentId;
      let list = childrenMap.get(key);
      if (!list) { list = []; childrenMap.set(key, list); }
      list.push(node);
      if (node.parentId !== null) hasChildrenSet.add(node.parentId);
    }

    const traverse = (parentId: string | null, level: number): void => {
      const children = childrenMap.get(parentId) ?? [];
      for (const node of children) {
        const hasChildren = hasChildrenSet.has(node.id);
        result.push({ ...node, level, hasChildren });
        if (node.expanded && hasChildren) {
          traverse(node.id, level + 1);
        }
        if (this.pendingAdd?.parentId === node.id) {
          result.push(this.makeSentinel(node.id, level + 1));
        }
      }
    };

    traverse(null, 0);

    if (this.pendingAdd?.parentId === null) {
      result.push(this.makeSentinel(null, 0));
    }

    return result;
  }

  private makeSentinel(parentId: string | null, level: number): FlatNode {
    return {
      id: SENTINEL_ID, label: '', category: 'Atividade', responsible: '',
      status: 'ativo', parentId, expanded: false, level, hasChildren: false,
    };
  }

  trackById(_i: number, n: FlatNode): string {
    return n.id;
  }

  toggle(node: FlatNode): void {
    const found = this.nodes.find(n => n.id === node.id);
    if (found) found.expanded = !found.expanded;
  }

  // â”€â”€ Add â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  startAdd(parentId: string | null): void {
    this.cancelEdit();
    this.addForm    = { label: '', category: 'Atividade', responsible: '', status: 'ativo' };
    this.pendingAdd = { parentId };
    if (parentId !== null) {
      const parent = this.nodes.find(n => n.id === parentId);
      if (parent) parent.expanded = true;
    }
  }

  cancelAdd(): void {
    this.pendingAdd = null;
  }

  saveAdd(): void {
    if (!this.addForm.label.trim()) {
      this.notification.warning('O campo Nome Ã© obrigatÃ³rio.');
      return;
    }
    this.nodes = [...this.nodes, {
      id:          Date.now().toString(),
      label:       this.addForm.label,
      category:    this.addForm.category,
      responsible: this.addForm.responsible,
      status:      this.addForm.status,
      parentId:    this.pendingAdd!.parentId,
      expanded:    false,
    }];
    this.pendingAdd = null;
    this.notification.success('Registro adicionado com sucesso.');
  }

  // â”€â”€ Edit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  startEdit(node: FlatNode): void {
    this.cancelAdd();
    this.editingId = node.id;
    this.editForm  = {
      label:       node.label,
      category:    node.category,
      responsible: node.responsible,
      status:      node.status,
    };
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editForm.label.trim()) {
      this.notification.warning('O campo Nome Ã© obrigatÃ³rio.');
      return;
    }
    const idx = this.nodes.findIndex(n => n.id === this.editingId);
    if (idx > -1) {
      this.nodes[idx] = { ...this.nodes[idx], ...this.editForm };
      this.nodes = [...this.nodes]; // trigger change detection
      this.notification.success('Registro atualizado com sucesso.');
    }
    this.editingId = null;
  }

  // â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  deleteNode(node: FlatNode): void {
    const ids = new Set([node.id, ...this.getAllDescendantIds(node.id)]);
    this.nodes = this.nodes.filter(n => !ids.has(n.id));
    this.notification.success(`"${node.label}" excluÃ­do com sucesso.`);
  }

  // â”€â”€ Display helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  statusLabel(status: NodeStatus): string {
    const labels: Record<NodeStatus, string> = {
      ativo: 'Ativo', inativo: 'Inativo', pendente: 'Pendente',
    };
    return labels[status];
  }

  statusType(status: NodeStatus): PoTagType {
    const types: Record<NodeStatus, PoTagType> = {
      ativo: PoTagType.Success, inativo: PoTagType.Danger, pendente: PoTagType.Warning,
    };
    return types[status];
  }

  indentPx(level: number): string {
    return `${level * 28}px`;
  }

  private getAllDescendantIds(parentId: string): string[] {
    const ids: string[] = [];
    const children = this.nodes.filter(n => n.parentId === parentId);
    for (const child of children) {
      ids.push(child.id);
      ids.push(...this.getAllDescendantIds(child.id));
    }
    return ids;
  }

  private expandAll(): void {
    this.nodes = this.nodes.map(n => ({ ...n, expanded: true }));
  }

  private collapseAll(): void {
    this.nodes = this.nodes.map(n => ({ ...n, expanded: false }));
  }
}
