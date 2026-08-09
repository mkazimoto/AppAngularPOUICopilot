import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  PoAvatarModule,
  PoBadgeModule,
  PoButtonModule,
  PoDividerModule,
  PoDropdownAction,
  PoDropdownModule,
  PoInfoModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoProgressModule,
  PoProgressStatus,
  PoTagModule,
  PoTagType,
} from '@po-ui/ng-components';

// ── API pública do componente (padrão PO-UI: prefixo `p-`) ───────────────

/** Tipo de anexo de uma tarefa. */
export type KanbanAttachmentType = 'image' | 'pdf' | 'doc' | 'spreadsheet' | 'text' | 'code';

/** Anexo de uma tarefa do kanban. */
export interface KanbanAttachment {
  name: string;
  type: KanbanAttachmentType;
  url: string;
}

/** Tarefa exibida como card no quadro kanban. */
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
  attachmentFiles?: KanbanAttachment[];
}

/** Coluna do quadro kanban. */
export interface KanbanColumn {
  id: string;
  title: string;
  badgeStatus: 'positive' | 'negative' | 'warning' | 'disabled';
}

/**
 * Quadro kanban reutilizável com arrastar/soltar.
 *
 * Recebe as colunas via `[pColumns]` e as tarefas via two-way binding
 * (`[(pTarefas)]`). Inclui cards com prioridade, progresso e anexos,
 * menu de ações por card, modal de detalhes e pré-visualização de
 * anexos. Quando `pEditable` é `false`, vira apenas um visualizador.
 */
@Component({
  selector: 'app-kanban-board',
  imports: [
    CommonModule,
    PoAvatarModule,
    PoTagModule,
    PoButtonModule,
    PoBadgeModule,
    PoModalModule,
    PoInfoModule,
    PoDividerModule,
    PoProgressModule,
    PoDropdownModule,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  // ── Referências ─────────────────────────────────────────────────────────

  @ViewChild('detailModal') detailModal!: PoModalComponent;
  @ViewChild('previewModal') previewModal!: PoModalComponent;

  // ── Inputs (padrão PO-UI) ───────────────────────────────────────────────

  /** Colunas do quadro. */
  readonly pColumns = input<KanbanColumn[]>([]);

  /** Tarefas do quadro (two-way binding com o consumidor). */
  readonly pTarefas = model<KanbanTask[]>([]);

  /** Habilita arrastar/soltar, mover e excluir tarefas. */
  readonly pEditable = input(true);

  // ── Outputs (padrão PO-UI) ──────────────────────────────────────────────

  /** Emitido quando uma tarefa muda de coluna (arrastar ou menu). */
  readonly pMover = output<KanbanTask>();

  /** Emitido quando uma tarefa é excluída. */
  readonly pExcluir = output<KanbanTask>();

  /** Emitido ao abrir os detalhes de uma tarefa. */
  readonly pDetalhes = output<KanbanTask>();

  // ── Estado local (signals) ──────────────────────────────────────────────

  readonly draggingTaskId = signal<number | null>(null);
  readonly dragOverColumnId = signal<string | null>(null);
  readonly selectedTask = signal<KanbanTask | null>(null);
  readonly selectedAttachment = signal<KanbanAttachment | null>(null);

  readonly PoTagType = PoTagType;

  // ── Ações das modais ────────────────────────────────────────────────────

  readonly modalCloseAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.detailModal?.close(),
  };

  readonly previewCloseAction: PoModalAction = {
    label: 'Fechar',
    action: () => this.previewModal?.close(),
  };

  // ── Consultas do template ───────────────────────────────────────────────

  getTasksByColumn(columnId: string): KanbanTask[] {
    return this.pTarefas().filter(t => t.column === columnId);
  }

  getColumnCount(columnId: string): number {
    return this.pTarefas().filter(t => t.column === columnId).length;
  }

  getColumnLabel(columnId: string): string {
    return this.pColumns().find(c => c.id === columnId)?.title ?? columnId;
  }

  getProgressStatus(progress: number): PoProgressStatus {
    return progress === 100 ? PoProgressStatus.Success : PoProgressStatus.Default;
  }

  // ── Drag & Drop ─────────────────────────────────────────────────────────

  onDragStart(task: KanbanTask): void {
    if (this.pEditable()) {
      this.draggingTaskId.set(task.id);
    }
  }

  onDragEnd(): void {
    this.draggingTaskId.set(null);
    this.dragOverColumnId.set(null);
  }

  onDragOver(event: DragEvent, columnId: string): void {
    if (this.pEditable()) {
      event.preventDefault();
      this.dragOverColumnId.set(columnId);
    }
  }

  onDragLeave(columnId: string): void {
    if (this.dragOverColumnId() === columnId) {
      this.dragOverColumnId.set(null);
    }
  }

  onDrop(columnId: string): void {
    const id = this.draggingTaskId();
    if (id !== null) {
      this.moverParaColuna(id, columnId);
    }
    this.draggingTaskId.set(null);
    this.dragOverColumnId.set(null);
  }

  isDragging(task: KanbanTask): boolean {
    return this.draggingTaskId() === task.id;
  }

  isDropTarget(columnId: string): boolean {
    return this.dragOverColumnId() === columnId;
  }

  // ── Ações dos cards ─────────────────────────────────────────────────────

  moveTask(task: KanbanTask, direction: 'forward' | 'back'): void {
    const columnIds = this.pColumns().map(c => c.id);
    const currentIndex = columnIds.indexOf(task.column);
    if (direction === 'forward' && currentIndex < columnIds.length - 1) {
      this.moverParaColuna(task.id, columnIds[currentIndex + 1]);
    } else if (direction === 'back' && currentIndex > 0) {
      this.moverParaColuna(task.id, columnIds[currentIndex - 1]);
    }
  }

  cardActions(task: KanbanTask): PoDropdownAction[] {
    const actions: PoDropdownAction[] = [
      { label: 'Ver Detalhes', icon: 'an an-eye', action: () => this.openDetail(task) },
    ];

    const columns = this.pColumns();
    const index = columns.findIndex(c => c.id === task.column);
    const prev = columns[index - 1];
    const next = columns[index + 1];

    if (this.pEditable()) {
      if (prev) {
        actions.push({
          label: `Mover para «${prev.title}»`,
          icon: 'an an-arrow-left',
          action: () => this.moveTask(task, 'back'),
        });
      }
      if (next) {
        actions.push({
          label: `Mover para «${next.title}»`,
          icon: 'an an-arrow-right',
          action: () => this.moveTask(task, 'forward'),
        });
      }
      actions.push({ label: 'Excluir Tarefa', icon: 'an an-trash', action: () => this.deleteTask(task) });
    }

    return actions;
  }

  deleteTask(task: KanbanTask): void {
    this.pTarefas.update(tasks => tasks.filter(t => t.id !== task.id));
    this.pExcluir.emit(task);
  }

  // ── Modais ──────────────────────────────────────────────────────────────

  openDetail(task: KanbanTask): void {
    this.selectedTask.set(task);
    this.pDetalhes.emit(task);
    this.detailModal?.open();
  }

  previewAttachment(file: KanbanAttachment): void {
    this.selectedAttachment.set(file);
    this.previewModal?.open();
  }

  openAttachment(file: KanbanAttachment): void {
    window.open(file.url, '_blank');
  }

  getAttachmentIcon(type: KanbanAttachmentType): string {
    const icons: Record<KanbanAttachmentType, string> = {
      image: 'an an-image',
      pdf: 'an an-file',
      doc: 'an an-file-text',
      spreadsheet: 'an an-table',
      text: 'an an-file-text',
      code: 'an an-code',
    };
    return icons[type] ?? 'an an-file';
  }

  // ── Internos ────────────────────────────────────────────────────────────

  private moverParaColuna(taskId: number, columnId: string): void {
    let movida: KanbanTask | undefined;
    this.pTarefas.update(tasks =>
      tasks.map(t => {
        if (t.id === taskId && t.column !== columnId) {
          movida = { ...t, column: columnId };
          return movida;
        }
        return t;
      }),
    );
    if (movida) {
      this.pMover.emit(movida);
    }
  }
}
