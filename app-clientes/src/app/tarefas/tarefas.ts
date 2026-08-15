import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, NgZone, signal } from '@angular/core';
import {
    PoContainerModule,
    PoDividerModule,
    PoPageModule,
    PoProgressModule,
    PoTableColumn,
    PoTableModule,
} from '@po-ui/ng-components';

export interface Tarefa {
  id: number;
  titulo: string;
  responsavel: string;
  status: string;
  prioridade: string;
  dataInicio: string;
  dataFim: string;
  progresso: number;
  startDay: number;
  duration: number;
  barColor: string;
}

@Component({
  selector: 'app-tarefas',
  imports: [
    CommonModule,
    PoPageModule,
    PoTableModule,
    PoDividerModule,
    PoProgressModule,
    PoContainerModule,
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tarefas {
  /** Projeto: 01/03/2026 a 31/05/2026 — 92 dias */
  readonly totalDays = 92;
  /** Hoje: 19/03/2026 = dia 18 a partir de 01/03 */
  readonly todayDay = 18;

  /** Tarefa em arrasto (highlight na barra). */
  readonly dragTaskId = signal<number | null>(null);
  /** Tarefa em redimensionamento (highlight na barra). */
  readonly resizeTaskId = signal<number | null>(null);
  readonly resizeEdge = signal<'left' | 'right' | null>(null);

  private readonly projectStart = new Date(2026, 2, 1); // 01/03/2026

  readonly ganttMonths = [
    { label: 'Março 2026', widthPct: (31 / 92) * 100 },
    { label: 'Abril 2026', widthPct: (30 / 92) * 100 },
    { label: 'Maio 2026', widthPct: (31 / 92) * 100 },
  ];

  readonly todayPct = computed(() => (this.todayDay / this.totalDays) * 100);

  colunas: PoTableColumn[] = [
    { property: 'id', label: '#', width: '5%' },
    { property: 'titulo', label: 'Tarefa', width: '22%' },
    { property: 'responsavel', label: 'Responsável', width: '14%' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      width: '15%',
      labels: [
        { value: 'todo', label: 'A Fazer', color: 'color-09' },
        { value: 'doing', label: 'Em Andamento', color: 'color-08' },
        { value: 'done', label: 'Concluído', color: 'color-11' },
      ],
    },
    {
      property: 'prioridade',
      label: 'Prioridade',
      type: 'label',
      width: '10%',
      labels: [
        { value: 'baixa', label: 'Baixa', color: 'color-11' },
        { value: 'media', label: 'Média', color: 'color-08' },
        { value: 'alta', label: 'Alta', color: 'color-07' },
      ],
    },
    { property: 'dataInicio', label: 'Início', width: '10%' },
    { property: 'dataFim', label: 'Fim', width: '10%' },
    { property: 'progresso', label: 'Progresso', type: 'columnTemplate', width: '14%' },
  ];

  readonly tarefas = signal<Tarefa[]>([
    {
      id: 1,
      titulo: 'Planejamento',
      responsavel: 'Ana Silva',
      status: 'done',
      prioridade: 'alta',
      dataInicio: '01/03/2026',
      dataFim: '10/03/2026',
      progresso: 100,
      startDay: 0,
      duration: 10,
      barColor: '#198754',
    },
    {
      id: 2,
      titulo: 'Design UI/UX',
      responsavel: 'Carlos Melo',
      status: 'done',
      prioridade: 'alta',
      dataInicio: '08/03/2026',
      dataFim: '20/03/2026',
      progresso: 100,
      startDay: 7,
      duration: 13,
      barColor: '#0d6efd',
    },
    {
      id: 3,
      titulo: 'Desenv. Frontend',
      responsavel: 'Beatriz Costa',
      status: 'doing',
      prioridade: 'alta',
      dataInicio: '18/03/2026',
      dataFim: '15/04/2026',
      progresso: 40,
      startDay: 17,
      duration: 28,
      barColor: '#fd7e14',
    },
    {
      id: 4,
      titulo: 'Desenv. Backend',
      responsavel: 'Diego Lima',
      status: 'doing',
      prioridade: 'alta',
      dataInicio: '25/03/2026',
      dataFim: '20/04/2026',
      progresso: 30,
      startDay: 24,
      duration: 26,
      barColor: '#6f42c1',
    },
    {
      id: 5,
      titulo: 'Integração de APIs',
      responsavel: 'Elena Rocha',
      status: 'todo',
      prioridade: 'media',
      dataInicio: '10/04/2026',
      dataFim: '30/04/2026',
      progresso: 0,
      startDay: 40,
      duration: 20,
      barColor: '#17a2b8',
    },
    {
      id: 6,
      titulo: 'Testes QA',
      responsavel: 'Fábio Santos',
      status: 'todo',
      prioridade: 'media',
      dataInicio: '25/04/2026',
      dataFim: '15/05/2026',
      progresso: 0,
      startDay: 55,
      duration: 20,
      barColor: '#e83e8c',
    },
    {
      id: 7,
      titulo: 'Revisão de Segurança',
      responsavel: 'Gabi Nunes',
      status: 'todo',
      prioridade: 'alta',
      dataInicio: '05/05/2026',
      dataFim: '20/05/2026',
      progresso: 0,
      startDay: 65,
      duration: 15,
      barColor: '#dc3545',
    },
    {
      id: 8,
      titulo: 'Deploy / Homologação',
      responsavel: 'Hugo Alves',
      status: 'todo',
      prioridade: 'media',
      dataInicio: '15/05/2026',
      dataFim: '31/05/2026',
      progresso: 0,
      startDay: 75,
      duration: 16,
      barColor: '#20c997',
    },
  ]);

  constructor(private ngZone: NgZone) {}

  getBarStyle(t: Tarefa): Record<string, string> {
    return {
      left: `${(t.startDay / this.totalDays) * 100}%`,
      width: `${(t.duration / this.totalDays) * 100}%`,
      backgroundColor: t.barColor,
    };
  }

  /** Inicia o arrastar da barra (gesto fora do zone, commit no mouseup). */
  onBarMouseDown(event: MouseEvent, tarefa: Tarefa): void {
    event.preventDefault();
    const barEl = (event.currentTarget as HTMLElement).closest('.gantt-bar') as HTMLElement;
    const containerEl = barEl.parentElement!;
    this.dragTaskId.set(tarefa.id);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    const startX = event.clientX;
    const initialStartDay = tarefa.startDay;
    const dayWidth = containerEl.clientWidth / this.totalDays;
    let currentStart = initialStartDay;

    this.ngZone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent): void => {
        currentStart = Math.max(
          0,
          Math.min(this.totalDays - tarefa.duration, initialStartDay + Math.round((e.clientX - startX) / dayWidth))
        );
        barEl.style.left = `${(currentStart / this.totalDays) * 100}%`;
      };
      const onUp = (): void => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        this.dragTaskId.set(null);
        if (currentStart !== initialStartDay) {
          this.commitTarefa(tarefa.id, { startDay: currentStart });
        }
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /** Inicia redimensionamento pelo handle esquerdo ou direito (gesto fora do zone). */
  onResizeMouseDown(event: MouseEvent, tarefa: Tarefa, edge: 'left' | 'right'): void {
    event.preventDefault();
    event.stopPropagation();
    const barEl = (event.currentTarget as HTMLElement).closest('.gantt-bar') as HTMLElement;
    const containerEl = (event.currentTarget as HTMLElement).closest('.gantt-cell-bar') as HTMLElement;
    this.resizeTaskId.set(tarefa.id);
    this.resizeEdge.set(edge);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    const startX = event.clientX;
    const initialStartDay = tarefa.startDay;
    const initialDuration = tarefa.duration;
    const dayWidth = containerEl.clientWidth / this.totalDays;
    let currentStart = initialStartDay;
    let currentDuration = initialDuration;

    this.ngZone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent): void => {
        const deltaDays = Math.round((e.clientX - startX) / dayWidth);
        if (edge === 'right') {
          currentDuration = Math.max(1, Math.min(this.totalDays - currentStart, initialDuration + deltaDays));
        } else {
          currentStart = Math.max(0, Math.min(initialStartDay + initialDuration - 1, initialStartDay + deltaDays));
          currentDuration = initialDuration - (currentStart - initialStartDay);
        }
        barEl.style.left = `${(currentStart / this.totalDays) * 100}%`;
        barEl.style.width = `${(currentDuration / this.totalDays) * 100}%`;
      };
      const onUp = (): void => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        this.resizeTaskId.set(null);
        this.resizeEdge.set(null);
        if (currentStart !== initialStartDay || currentDuration !== initialDuration) {
          this.commitTarefa(tarefa.id, { startDay: currentStart, duration: currentDuration });
        }
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /** Commit imutável no signal, recalculando as datas. */
  private commitTarefa(id: number, patch: Partial<Pick<Tarefa, 'startDay' | 'duration'>>): void {
    this.tarefas.update(list =>
      list.map(t => {
        if (t.id !== id) return t;
        const atualizada = { ...t, ...patch };
        const { dataInicio, dataFim } = this.calcDates(atualizada.startDay, atualizada.duration);
        return { ...atualizada, dataInicio, dataFim };
      })
    );
  }

  private calcDates(startDay: number, duration: number): { dataInicio: string; dataFim: string } {
    const start = new Date(this.projectStart);
    start.setDate(start.getDate() + startDay);
    const end = new Date(start);
    end.setDate(end.getDate() + duration - 1);
    return { dataInicio: this.formatDate(start), dataFim: this.formatDate(end) };
  }

  private formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
}
