import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  PoAvatarModule,
  PoBadgeModule,
  PoButtonModule,
  PoDividerModule,
  PoInfoModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoProgressModule,
  PoProgressStatus,
  PoTagModule,
  PoTagType,
} from '@po-ui/ng-components';

export interface KanbanTask {
  id: number;
  title: string;
  description: string;
  priority: string;
  priorityType: PoTagType;
  assignee: string;
  photo: string;
  column: string;
  dueDate?: string;
  tags?: string[];
  effort?: string;
  progress: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  badgeStatus: 'positive' | 'negative' | 'warning' | 'disabled';
}

@Component({
  selector: 'app-kanban',
  imports: [CommonModule, PoPageModule, PoAvatarModule, PoTagModule, PoButtonModule, PoBadgeModule, PoModalModule, PoInfoModule, PoDividerModule, PoProgressModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban {
  @ViewChild('detailModal') detailModal!: PoModalComponent;

  readonly PoTagType = PoTagType;
  readonly PoProgressStatus = PoProgressStatus;

  columns: KanbanColumn[] = [
    { id: 'todo', title: 'A Fazer', badgeStatus: 'disabled' },
    { id: 'doing', title: 'Em Progresso', badgeStatus: 'warning' },
    { id: 'review', title: 'Em Revisão', badgeStatus: 'positive' },
    { id: 'done', title: 'Concluído', badgeStatus: 'positive' },
  ];

  draggingTaskId: number | null = null;
  dragOverColumnId: string | null = null;

  tasks: KanbanTask[] = [
    {
      id: 1,
      title: 'Criar tela de login',
      description: 'Implementar autenticação com JWT e refresh token',
      priority: 'Alta',
      priorityType: PoTagType.Danger,
      assignee: 'Ana Silva',
      photo: 'https://i.pravatar.cc/150?img=1',
      column: 'todo',
      dueDate: '28/03/2026',
      effort: '8h',
      tags: ['frontend', 'segurança'],
      progress: 0,
    },
    {
      id: 2,
      title: 'Refatorar API de clientes',
      description: 'Melhorar performance das queries no banco',
      priority: 'Média',
      priorityType: PoTagType.Warning,
      assignee: 'Carlos Souza',
      photo: 'https://i.pravatar.cc/150?img=3',
      column: 'todo',
      dueDate: '02/04/2026',
      effort: '5h',
      tags: ['backend', 'performance'],
      progress: 0,
    },
    {
      id: 3,
      title: 'Design system tokens',
      description: 'Mapear e documentar todos os tokens CSS',
      priority: 'Baixa',
      priorityType: PoTagType.Info,
      assignee: 'Beatriz Lima',
      photo: 'https://i.pravatar.cc/150?img=5',
      column: 'todo',
      dueDate: '10/04/2026',
      effort: '3h',
      tags: ['design', 'css'],
      progress: 0,
    },
    {
      id: 4,
      title: 'Revisar layout dashboard',
      description: 'Ajustar responsividade para dispositivos móveis',
      priority: 'Alta',
      priorityType: PoTagType.Danger,
      assignee: 'Marina Costa',
      photo: 'https://i.pravatar.cc/150?img=9',
      column: 'doing',
      dueDate: '22/03/2026',
      effort: '6h',
      tags: ['frontend', 'responsivo'],
      progress: 60,
    },
    {
      id: 5,
      title: 'Integrar gateway de pagamento',
      description: 'Configurar PagSeguro e Stripe no checkout',
      priority: 'Alta',
      priorityType: PoTagType.Danger,
      assignee: 'Pedro Lima',
      photo: 'https://i.pravatar.cc/150?img=7',
      column: 'doing',
      dueDate: '25/03/2026',
      effort: '12h',
      tags: ['backend', 'pagamento'],
      progress: 45,
    },
    {
      id: 6,
      title: 'Notificações push',
      description: 'Implementar Firebase Cloud Messaging',
      priority: 'Média',
      priorityType: PoTagType.Warning,
      assignee: 'Rodrigo Neves',
      photo: 'https://i.pravatar.cc/150?img=11',
      column: 'doing',
      dueDate: '30/03/2026',
      effort: '4h',
      tags: ['mobile', 'firebase'],
      progress: 30,
    },
    {
      id: 7,
      title: 'Testes unitários — Produtos',
      description: 'Cobertura mínima de 80% no módulo de produtos',
      priority: 'Média',
      priorityType: PoTagType.Warning,
      assignee: 'Julia Ferreira',
      photo: 'https://i.pravatar.cc/150?img=16',
      column: 'review',
      dueDate: '21/03/2026',
      effort: '6h',
      tags: ['testes', 'qualidade'],
      progress: 85,
    },
    {
      id: 8,
      title: 'Deploy em produção',
      description: 'Pipeline CI/CD com GitHub Actions configurado',
      priority: 'Alta',
      priorityType: PoTagType.Danger,
      assignee: 'Roberto Alves',
      photo: 'https://i.pravatar.cc/150?img=13',
      column: 'review',
      dueDate: '20/03/2026',
      effort: '3h',
      tags: ['devops', 'ci-cd'],
      progress: 90,
    },
    {
      id: 9,
      title: 'Documentação da API',
      description: 'Swagger atualizado com todos os endpoints REST',
      priority: 'Baixa',
      priorityType: PoTagType.Info,
      assignee: 'Luciana Ramos',
      photo: 'https://i.pravatar.cc/150?img=20',
      column: 'done',
      dueDate: '15/03/2026',
      effort: '4h',
      tags: ['documentação', 'api'],
      progress: 100,
    },
    {
      id: 10,
      title: 'Otimização de imagens',
      description: 'Compressão automática e lazy loading nas páginas',
      priority: 'Baixa',
      priorityType: PoTagType.Info,
      assignee: 'Felipe Santos',
      photo: 'https://i.pravatar.cc/150?img=15',
      column: 'done',
      dueDate: '12/03/2026',
      effort: '2h',
      tags: ['performance', 'imagens'],
      progress: 100,
    },
    {
      id: 11,
      title: 'Acessibilidade WCAG 2.1',
      description: 'Revisão de contraste e suporte a leitores de tela',
      priority: 'Média',
      priorityType: PoTagType.Warning,
      assignee: 'Camila Braga',
      photo: 'https://i.pravatar.cc/150?img=25',
      column: 'done',
      dueDate: '10/03/2026',
      effort: '5h',
      tags: ['acessibilidade', 'ux'],
      progress: 100,
    },
  ];

  selectedTask: KanbanTask | null = null;

  modalCloseAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.detailModal.close(),
  };

  getProgressStatus(progress: number): PoProgressStatus {
    return progress === 100 ? PoProgressStatus.Success : PoProgressStatus.Default;
  }

  getColumnLabel(columnId: string): string {
    return this.columns.find(c => c.id === columnId)?.title ?? columnId;
  }

  openDetail(task: KanbanTask): void {
    this.selectedTask = task;
    this.detailModal.open();
  }

  getTasksByColumn(columnId: string): KanbanTask[] {
    return this.tasks.filter(t => t.column === columnId);
  }

  getColumnCount(columnId: string): number {
    return this.tasks.filter(t => t.column === columnId).length;
  }

  // Drag & Drop
  onDragStart(task: KanbanTask): void {
    this.draggingTaskId = task.id;
  }

  onDragEnd(): void {
    this.draggingTaskId = null;
    this.dragOverColumnId = null;
  }

  onDragOver(event: DragEvent, columnId: string): void {
    event.preventDefault();
    this.dragOverColumnId = columnId;
  }

  onDragLeave(columnId: string): void {
    if (this.dragOverColumnId === columnId) {
      this.dragOverColumnId = null;
    }
  }

  onDrop(columnId: string): void {
    if (this.draggingTaskId !== null) {
      const task = this.tasks.find(t => t.id === this.draggingTaskId);
      if (task) {
        task.column = columnId;
      }
    }
    this.draggingTaskId = null;
    this.dragOverColumnId = null;
  }

  isDragging(task: KanbanTask): boolean {
    return this.draggingTaskId === task.id;
  }

  isDropTarget(columnId: string): boolean {
    return this.dragOverColumnId === columnId;
  }

  moveTask(task: KanbanTask, direction: 'forward' | 'back'): void {
    const columnIds = this.columns.map(c => c.id);
    const currentIndex = columnIds.indexOf(task.column);
    if (direction === 'forward' && currentIndex < columnIds.length - 1) {
      task.column = columnIds[currentIndex + 1];
    } else if (direction === 'back' && currentIndex > 0) {
      task.column = columnIds[currentIndex - 1];
    }
  }

  isFirstColumn(columnId: string): boolean {
    return this.columns[0].id === columnId;
  }

  isLastColumn(columnId: string): boolean {
    return this.columns[this.columns.length - 1].id === columnId;
  }
}
