import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  'Inicialização', 'Planejamento', 'Requisitos', 'Arquitetura', 'Desenvolvimento',
  'Testes', 'Integração', 'Implantação', 'Treinamento', 'Encerramento',
];

const ENTREGAVEIS = [
  'Escopo', 'Cronograma', 'Orçamento', 'Riscos', 'Qualidade',
  'Recursos', 'Comunicação', 'Contratos', 'Stakeholders', 'Mudanças',
];

const PACOTES = [
  'Definição', 'Análise', 'Design', 'Implementação', 'Revisão',
  'Aprovação', 'Documentação', 'Validação', 'Publicação', 'Monitoramento',
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
    label: 'EAP - Estrutura Analítica do Projeto',
    category: 'Projeto',
    responsible: 'João Silva',
    status: 'ativo',
    parentId: null,
    expanded: true,
  });

  // 10 fases × 10 entregáveis × 10 pacotes × 9 atividades = 9.000 + 1.000 + 100 + 10 + 1 = 10.111
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
        category: 'Entregável',
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
  imports: [CommonModule, FormsModule, ScrollingModule, PoButtonModule, PoFieldModule, PoPageModule, PoTagModule],
  templateUrl: './treeview.html',
  styleUrl: './treeview.css',
})
export class Treeview implements OnInit {
  readonly SENTINEL = SENTINEL_ID;
  readonly ROW_HEIGHT = 44;

  nodes: TreeNode[] = buildEapNodes();
  visibleNodes: FlatNode[] = [];

  editingId: string | null = null;
  editForm = { label: '', category: 'Fase', responsible: '', status: 'ativo' as NodeStatus };

  pendingAdd: { parentId: string | null } | null = null;
  addForm = { label: '', category: 'Atividade', responsible: '', status: 'ativo' as NodeStatus };

  readonly categoryOptions = [
    { label: 'Projeto',            value: 'Projeto'            },
    { label: 'Fase',               value: 'Fase'               },
    { label: 'Entregável',         value: 'Entregável'         },
    { label: 'Pacote de Trabalho', value: 'Pacote de Trabalho' },
    { label: 'Atividade',          value: 'Atividade'          },
  ];

  readonly statusOptions = [
    { label: 'Ativo',    value: 'ativo'    },
    { label: 'Inativo',  value: 'inativo'  },
    { label: 'Pendente', value: 'pendente' },
  ];

  readonly pageActions: PoPageAction[] = [
    { label: 'Adicionar Raiz', action: () => this.startAdd(null), icon: 'an an-plus-circle' },
    { label: 'Expandir Todos', action: () => this.expandAll(),    icon: 'an an-arrows-out'  },
    { label: 'Recolher Todos', action: () => this.collapseAll(),  icon: 'an an-arrows-in'   },
  ];

  constructor(private notification: PoNotificationService) {}

  ngOnInit(): void { this.refreshVisibleNodes(); }

  refreshVisibleNodes(): void {
    const result: FlatNode[] = [];
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
      for (const node of (childrenMap.get(parentId) ?? [])) {
        const hasChildren = hasChildrenSet.has(node.id);
        result.push({ ...node, level, hasChildren });
        if (node.expanded && hasChildren) traverse(node.id, level + 1);
        if (this.pendingAdd?.parentId === node.id) result.push(this.makeSentinel(node.id, level + 1));
      }
    };
    traverse(null, 0);
    if (this.pendingAdd?.parentId === null) result.push(this.makeSentinel(null, 0));
    this.visibleNodes = result;
  }

  private makeSentinel(parentId: string | null, level: number): FlatNode {
    return { id: SENTINEL_ID, label: '', category: 'Atividade', responsible: '', status: 'ativo', parentId, expanded: false, level, hasChildren: false };
  }

  trackById(_i: number, n: FlatNode): string { return n.id; }

  toggle(node: FlatNode): void {
    const found = this.nodes.find(n => n.id === node.id);
    if (found) { found.expanded = !found.expanded; this.refreshVisibleNodes(); }
  }

  startAdd(parentId: string | null): void {
    this.cancelEdit();
    this.addForm = { label: '', category: 'Atividade', responsible: '', status: 'ativo' };
    this.pendingAdd = { parentId };
    if (parentId !== null) {
      const parent = this.nodes.find(n => n.id === parentId);
      if (parent) parent.expanded = true;
    }
    this.refreshVisibleNodes();
  }

  cancelAdd(): void { this.pendingAdd = null; this.refreshVisibleNodes(); }

  saveAdd(): void {
    if (!this.addForm.label.trim()) { this.notification.warning('O campo Nome e obrigatorio.'); return; }
    this.nodes = [...this.nodes, {
      id: Date.now().toString(), label: this.addForm.label, category: this.addForm.category,
      responsible: this.addForm.responsible, status: this.addForm.status,
      parentId: this.pendingAdd!.parentId, expanded: false,
    }];
    this.pendingAdd = null;
    this.refreshVisibleNodes();
    this.notification.success('Registro adicionado com sucesso.');
  }

  startEdit(node: FlatNode): void {
    this.cancelAdd();
    this.editingId = node.id;
    this.editForm = { label: node.label, category: node.category, responsible: node.responsible, status: node.status };
    this.refreshVisibleNodes();
  }

  cancelEdit(): void { this.editingId = null; this.refreshVisibleNodes(); }

  saveEdit(): void {
    if (!this.editForm.label.trim()) { this.notification.warning('O campo Nome e obrigatorio.'); return; }
    const idx = this.nodes.findIndex(n => n.id === this.editingId);
    if (idx > -1) {
      this.nodes[idx] = { ...this.nodes[idx], ...this.editForm };
      this.notification.success('Registro atualizado com sucesso.');
    }
    this.editingId = null;
    this.refreshVisibleNodes();
  }

  deleteNode(node: FlatNode): void {
    const ids = new Set([node.id, ...this.getAllDescendantIds(node.id)]);
    this.nodes = this.nodes.filter(n => !ids.has(n.id));
    this.refreshVisibleNodes();
    this.notification.success('Registro excluido com sucesso.');
  }

  statusLabel(status: NodeStatus): string {
    return { ativo: 'Ativo', inativo: 'Inativo', pendente: 'Pendente' }[status];
  }

  statusType(status: NodeStatus): PoTagType {
    return { ativo: PoTagType.Success, inativo: PoTagType.Danger, pendente: PoTagType.Warning }[status];
  }

  indentPx(level: number): string { return level * 24 + 'px'; }

  private getAllDescendantIds(parentId: string): string[] {
    const childrenMap = new Map<string, string[]>();
    for (const n of this.nodes) {
      if (n.parentId) {
        const list = childrenMap.get(n.parentId) ?? [];
        list.push(n.id);
        childrenMap.set(n.parentId, list);
      }
    }
    const collect = (id: string): string[] => {
      const ids: string[] = [];
      for (const childId of (childrenMap.get(id) ?? [])) { ids.push(childId, ...collect(childId)); }
      return ids;
    };
    return collect(parentId);
  }

  private expandAll(): void { this.nodes = this.nodes.map(n => ({ ...n, expanded: true })); this.refreshVisibleNodes(); }
  private collapseAll(): void { this.nodes = this.nodes.map(n => ({ ...n, expanded: false })); this.refreshVisibleNodes(); }
}