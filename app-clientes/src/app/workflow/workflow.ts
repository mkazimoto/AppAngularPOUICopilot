import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
    PoButtonModule,
    PoDividerModule,
    PoModalAction,
    PoModalComponent,
    PoModalModule,
    PoPageModule,
    PoTagModule,
    PoTagType,
    PoTooltipModule
} from '@po-ui/ng-components';

export type WorkflowNodeType = 'start' | 'end' | 'decision' | 'action';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'done' | 'rejected';
  connections: string[];
}

@Component({
  selector: 'app-workflow',
  imports: [
    CommonModule,
    PoPageModule,
    PoButtonModule,
    PoTagModule,
    PoModalModule,
    PoDividerModule,
    PoTooltipModule,
  ],
  templateUrl: './workflow.html',
  styleUrl: './workflow.css',
})
export class Workflow {
  @ViewChild('nodeModal') nodeModal!: PoModalComponent;

  selectedNode: WorkflowNode | null = null;
  activeNodeId: string = 'start';

  nodes: WorkflowNode[] = [
    {
      id: 'start',
      type: 'start',
      label: 'Início',
      description: 'Ponto de entrada do processo de aprovação de pedido.',
      status: 'done',
      connections: ['validate'],
    },
    {
      id: 'validate',
      type: 'action',
      label: 'Validar Pedido',
      description: 'Verifica os dados do pedido: itens, quantidades e valores.',
      status: 'done',
      connections: ['check_stock'],
    },
    {
      id: 'check_stock',
      type: 'decision',
      label: 'Estoque Disponível?',
      description: 'Verifica se os itens do pedido estão disponíveis no estoque.',
      status: 'active',
      connections: ['approve', 'reorder'],
    },
    {
      id: 'reorder',
      type: 'action',
      label: 'Solicitar Reposição',
      description: 'Envia solicitação de reposição de estoque ao fornecedor.',
      status: 'pending',
      connections: ['check_stock'],
    },
    {
      id: 'approve',
      type: 'action',
      label: 'Aprovar Pedido',
      description: 'Pedido aprovado automaticamente e encaminhado para faturamento.',
      status: 'pending',
      connections: ['notify'],
    },
    {
      id: 'notify',
      type: 'action',
      label: 'Notificar Cliente',
      description: 'Envia e-mail ao cliente com confirmação e previsão de entrega.',
      status: 'pending',
      connections: ['end'],
    },
    {
      id: 'end',
      type: 'end',
      label: 'Fim',
      description: 'Processo concluído com sucesso.',
      status: 'pending',
      connections: [],
    },
  ];

  get mainFlow(): WorkflowNode[] {
    return ['start', 'validate', 'check_stock', 'approve', 'notify', 'end'].map(
      id => this.nodes.find(n => n.id === id)!
    );
  }

  get branchFlow(): WorkflowNode[] {
    return ['reorder'].map(id => this.nodes.find(n => n.id === id)!);
  }

  getNodeTypeLabel(type: WorkflowNodeType): string {
    const labels: Record<WorkflowNodeType, string> = {
      start: 'Início',
      end: 'Fim',
      decision: 'Decisão',
      action: 'Ação',
    };
    return labels[type];
  }

  getNodeIcon(type: WorkflowNodeType): string {
    const icons: Record<WorkflowNodeType, string> = {
      start: 'an an-play-circle',
      end: 'an an-stop-circle',
      decision: 'an an-git-fork',
      action: 'an an-lightning',
    };
    return icons[type];
  }

  getStatusTagType(status: WorkflowNode['status']): PoTagType {
    const map: Record<WorkflowNode['status'], PoTagType> = {
      done: PoTagType.Success,
      active: PoTagType.Warning,
      pending: PoTagType.Neutral,
      rejected: PoTagType.Danger,
    };
    return map[status];
  }

  getStatusLabel(status: WorkflowNode['status']): string {
    const map: Record<WorkflowNode['status'], string> = {
      done: 'Concluído',
      active: 'Em Andamento',
      pending: 'Pendente',
      rejected: 'Rejeitado',
    };
    return map[status];
  }

  isActive(nodeId: string): boolean {
    return this.activeNodeId === nodeId;
  }

  openNodeDetail(node: WorkflowNode): void {
    this.selectedNode = node;
    this.nodeModal.open();
  }

  closeModal(): void {
    this.nodeModal.close();
  }

  advanceWorkflow(): void {
    const order = ['start', 'validate', 'check_stock', 'approve', 'notify', 'end'];
    const currentIndex = order.indexOf(this.activeNodeId);
    if (currentIndex < order.length - 1) {
      const current = this.nodes.find(n => n.id === this.activeNodeId);
      if (current) current.status = 'done';
      this.activeNodeId = order[currentIndex + 1];
      const next = this.nodes.find(n => n.id === this.activeNodeId);
      if (next) next.status = 'active';
    }
  }

  resetWorkflow(): void {
    this.nodes.forEach(n => {
      n.status = 'pending';
    });
    this.nodes[0].status = 'done';
    this.activeNodeId = 'validate';
    this.nodes[1].status = 'active';
  }

  get modalConfirmAction(): PoModalAction {
    return {
      label: 'Fechar',
      action: () => this.closeModal(),
    };
  }
}
