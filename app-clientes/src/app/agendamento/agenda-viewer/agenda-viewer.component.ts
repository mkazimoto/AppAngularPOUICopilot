import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  PoButtonGroupItem,
  PoButtonGroupModule,
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';

// ── API pública do componente (padrão PO-UI: prefixo `p-`) ───────────────

/** Agendamento exibido na grade. */
export interface AgendaItem {
  id: number;
  titulo: string;
  cliente?: string;
  dia: string; // 'YYYY-MM-DD'
  horaInicio: string; // 'HH:MM'
  horaFim: string; // 'HH:MM'
  tipo: string;
}

/** Opção de tipo de agendamento (rótulo + cor usada na grade e na legenda). */
export interface AgendaTipoOpcao {
  label: string;
  value: string;
  color?: string;
}

/** Evento emitido ao abrir a modal para criar ou editar um agendamento. */
export interface AgendaAbrirEvent {
  modo: 'novo' | 'edicao';
  item: AgendaItem | null;
}

// ── Tipos internos ────────────────────────────────────────────────────────

interface DiaCalendario {
  date: string;
  diaSemana: string;
  numero: number;
  mes: number;
  ano: number;
  isHoje: boolean;
  outOfMonth?: boolean;
}

// ── Constantes ────────────────────────────────────────────────────────────

const SLOT_HEIGHT = 48; // px por slot de 30 min
const COR_FALLBACK = '#1976d2';
const NOMES_DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES_ABREV = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DEFAULT_TIPO_OPTIONS: AgendaTipoOpcao[] = [
  { label: 'Consulta', value: 'consulta', color: '#1e88e5' },
  { label: 'Reunião', value: 'reuniao', color: '#43a047' },
  { label: 'Serviço', value: 'servico', color: '#fb8c00' },
  { label: 'Entrevista', value: 'entrevista', color: '#8e24aa' },
];

/**
 * Grade de agendamento reutilizável (visões semanal e mensal).
 *
 * Recebe a lista de agendamentos via two-way binding (`[(pAgendamentos)]`)
 * e as opções de tipo via `[pTipoOptions]`. Inclui navegação entre
 * semanas/meses, criação, edição, exclusão, arrastar/soltar e
 * redimensionamento — tudo em uma modal própria. Quando `pEditable` é
 * `false`, vira apenas um visualizador.
 */
@Component({
  selector: 'app-agenda-viewer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoButtonModule,
    PoButtonGroupModule,
    PoModalModule,
    PoFieldModule,
  ],
  templateUrl: './agenda-viewer.component.html',
  styleUrl: './agenda-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mousemove)': 'onResizeMove($event)',
    '(document:mouseup)': 'onResizeEnd()',
  },
})
export class AgendaViewerComponent implements OnInit {
  // ── Inputs (padrão PO-UI) ───────────────────────────────────────────────

  /** Lista de agendamentos (two-way binding com o consumidor). */
  readonly pAgendamentos = model<AgendaItem[]>([]);

  /** Opções de tipo usadas na legenda, no select e nas cores dos blocos. */
  readonly pTipoOptions = input<AgendaTipoOpcao[]>(DEFAULT_TIPO_OPTIONS);

  /** Habilita criação, edição, exclusão, arrastar e redimensionar. */
  readonly pEditable = input(true);

  /** Hora de início do expediente (padrão 7h). */
  readonly pHoraInicio = input(7);

  /** Hora de fim do expediente (padrão 20h). */
  readonly pHoraFim = input(20);

  /** Visão inicial exibida ao montar o componente. */
  readonly pViewInicial = input<'semanal' | 'mensal'>('semanal');

  // ── Outputs (padrão PO-UI) ──────────────────────────────────────────────

  /** Emitido ao abrir a modal (criação ou edição). */
  readonly pAbrir = output<AgendaAbrirEvent>();

  /** Emitido ao criar/atualizar um agendamento. */
  readonly pSalvar = output<AgendaItem>();

  /** Emitido ao excluir um agendamento. */
  readonly pExcluir = output<AgendaItem>();

  /** Emitido ao mover um agendamento (arrastar). */
  readonly pMover = output<AgendaItem>();

  /** Emitido ao redimensionar um agendamento. */
  readonly pRedimensionar = output<AgendaItem>();

  // ── Referências ─────────────────────────────────────────────────────────

  @ViewChild('modalAgendamento') private readonly modalAgendamento?: PoModalComponent;

  private readonly notification = inject(PoNotificationService);

  // ── Estado local (signals) ──────────────────────────────────────────────

  readonly viewMode = signal<'semanal' | 'mensal'>('semanal');
  readonly nomesDiasSemana = NOMES_DIAS;
  private readonly weekStart = signal(new Date());
  private readonly monthStart = signal(new Date());
  readonly dias = signal<DiaCalendario[]>([]);
  readonly semanasMes = signal<DiaCalendario[][]>([]);
  readonly horarios = signal<string[]>([]);
  readonly idEditando = signal<number | null>(null);
  readonly draggingId = signal<number | null>(null);
  private readonly dragOverSlot = signal<{ dia: string; hora: string } | null>(null);
  readonly resizingId = signal<number | null>(null);
  private readonly resizeType = signal<'start' | 'end' | null>(null);
  /** Prévia do item em redimensionamento (aplicada ao modelo só no fim do gesto). */
  private readonly resizePreview = signal<AgendaItem | null>(null);

  // Estado do redimensionamento (apenas durante o gesto)
  private resizeStartY = 0;
  private resizeOrigInicio = '';
  private resizeOrigFim = '';

  // ── Formulário da modal (criação/edição) ────────────────────────────────

  readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: Validators.required }),
    cliente: new FormControl('', { nonNullable: true }),
    dia: new FormControl('', { nonNullable: true }),
    horaInicio: new FormControl('', { nonNullable: true, validators: Validators.required }),
    horaFim: new FormControl('', { nonNullable: true, validators: Validators.required }),
    tipo: new FormControl('consulta', { nonNullable: true }),
  });

  // ── Estado derivado ─────────────────────────────────────────────────────

  readonly selectOptions = computed<PoSelectOption[]>(() =>
    this.pTipoOptions().map(o => ({ label: o.label, value: o.value })),
  );

  readonly viewButtons = computed<PoButtonGroupItem[]>(() => [
    { label: 'Semanal', action: () => this.setViewMode('semanal'), selected: this.viewMode() === 'semanal' },
    { label: 'Mensal', action: () => this.setViewMode('mensal'), selected: this.viewMode() === 'mensal' },
  ]);

  readonly titleModal = computed(() =>
    this.idEditando() ? 'Editar Agendamento' : 'Novo Agendamento',
  );

  readonly labelNavegacao = computed(() =>
    this.viewMode() === 'mensal' ? this.labelMes() : this.labelSemana(),
  );

  readonly labelSemana = computed(() => {
    const d = this.dias();
    if (d.length === 0) return '';
    const p = d[0];
    const u = d[6];
    if (p.mes === u.mes) {
      return `${p.numero}–${u.numero} de ${MESES[p.mes - 1]} de ${p.ano}`;
    }
    return `${p.numero}/${this.pad(p.mes)} – ${u.numero}/${this.pad(u.mes)} de ${p.ano}`;
  });

  readonly labelMes = computed(() => {
    const m = this.monthStart().getMonth() + 1;
    return `${MESES[m - 1]} de ${this.monthStart().getFullYear()}`;
  });

  /** Agendamentos agrupados por dia (Map<dia, itens>) — evita filtros no template. */
  readonly agendaPorDia = computed(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const a of this.pAgendamentos()) {
      const list = map.get(a.dia);
      if (list) list.push(a);
      else map.set(a.dia, [a]);
    }
    return map;
  });

  /** Slots ocupados (Set<'dia|hora'>) — usado nas células da semana. */
  readonly ocupadoPorSlot = computed(() => {
    const set = new Set<string>();
    for (const a of this.pAgendamentos()) {
      set.add(a.dia + '|' + a.horaInicio);
    }
    return set;
  });

  readonly confirmAction: PoModalAction = { label: 'Salvar', action: () => this.salvar() };
  readonly cancelAction: PoModalAction = { label: 'Cancelar', action: () => this.modalAgendamento?.close() };

  // ── Ciclo de vida ───────────────────────────────────────────────────────

  ngOnInit(): void {
    this.viewMode.set(this.pViewInicial());
    this.gerarHorarios();
    this.navegarParaHoje();
  }

  // ── Navegação ───────────────────────────────────────────────────────────

  navegarParaHoje(): void {
    const hoje = new Date();
    const offset = hoje.getDay() === 0 ? -6 : 1 - hoje.getDay();
    const weekStart = new Date(hoje);
    weekStart.setDate(hoje.getDate() + offset);
    weekStart.setHours(0, 0, 0, 0);
    this.weekStart.set(weekStart);
    this.monthStart.set(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    this.gerarSemana();
    if (this.viewMode() === 'mensal') {
      this.gerarMes();
    }
  }

  navAnterior(): void {
    if (this.viewMode() === 'mensal') {
      this.navAnteriorMes();
      return;
    }
    const prev = new Date(this.weekStart());
    prev.setDate(prev.getDate() - 7);
    this.weekStart.set(prev);
    this.gerarSemana();
  }

  navProxima(): void {
    if (this.viewMode() === 'mensal') {
      this.navProximaMes();
      return;
    }
    const next = new Date(this.weekStart());
    next.setDate(next.getDate() + 7);
    this.weekStart.set(next);
    this.gerarSemana();
  }

  navAnteriorMes(): void {
    this.monthStart.set(new Date(this.monthStart().getFullYear(), this.monthStart().getMonth() - 1, 1));
    this.gerarMes();
  }

  navProximaMes(): void {
    this.monthStart.set(new Date(this.monthStart().getFullYear(), this.monthStart().getMonth() + 1, 1));
    this.gerarMes();
  }

  setViewMode(mode: 'semanal' | 'mensal'): void {
    this.viewMode.set(mode);
    if (mode === 'mensal') {
      this.gerarMes();
    }
  }

  irParaSemana(date: string): void {
    const d = new Date(date + 'T00:00:00');
    const offset = d.getDay() === 0 ? -6 : 1 - d.getDay();
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() + offset);
    weekStart.setHours(0, 0, 0, 0);
    this.weekStart.set(weekStart);
    this.gerarSemana();
    this.viewMode.set('semanal');
  }

  // ── Geração do calendário ───────────────────────────────────────────────

  gerarHorarios(): void {
    const horarios: string[] = [];
    for (let h = this.pHoraInicio(); h <= this.pHoraFim(); h++) {
      horarios.push(`${this.pad(h)}:00`);
      if (h < this.pHoraFim()) {
        horarios.push(`${this.pad(h)}:30`);
      }
    }
    this.horarios.set(horarios);
  }

  gerarSemana(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dias: DiaCalendario[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStart());
      d.setDate(this.weekStart().getDate() + i);
      d.setHours(0, 0, 0, 0);
      dias.push({
        date: this.formatDate(d),
        diaSemana: NOMES_DIAS[d.getDay()],
        numero: d.getDate(),
        mes: d.getMonth() + 1,
        ano: d.getFullYear(),
        isHoje: d.getTime() === hoje.getTime(),
      });
    }
    this.dias.set(dias);
  }

  gerarMes(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ano = this.monthStart().getFullYear();
    const mes = this.monthStart().getMonth();
    const cursor = new Date(ano, mes, 1);
    cursor.setDate(cursor.getDate() - cursor.getDay());
    cursor.setHours(0, 0, 0, 0);

    const semanas: DiaCalendario[][] = [];
    for (let s = 0; s < 6; s++) {
      const semana: DiaCalendario[] = [];
      for (let d = 0; d < 7; d++) {
        semana.push({
          date: this.formatDate(cursor),
          diaSemana: NOMES_DIAS[cursor.getDay()],
          numero: cursor.getDate(),
          mes: cursor.getMonth() + 1,
          ano: cursor.getFullYear(),
          isHoje: cursor.getTime() === hoje.getTime(),
          outOfMonth: cursor.getMonth() !== mes,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      semanas.push(semana);
      if (s >= 4 && semana.every(d => d.outOfMonth)) {
        semanas.pop();
        break;
      }
    }
    this.semanasMes.set(semanas);
  }

  // ── Ações de criação/edição/exclusão ────────────────────────────────────

  novoAgendamento(): void {
    const hoje = new Date();
    this.abrirNovoAgendamento(this.formatDate(hoje), '08:00');
  }

  abrirNovoAgendamento(dia: string, hora: string): void {
    if (!this.pEditable()) return;
    this.idEditando.set(null);
    this.form.patchValue({
      titulo: '',
      cliente: '',
      dia,
      horaInicio: hora,
      horaFim: this.addMinutes(hora, 60),
      tipo: 'consulta',
    });
    this.pAbrir.emit({ modo: 'novo', item: null });
    this.modalAgendamento?.open();
  }

  abrirEdicao(ag: AgendaItem, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.pEditable()) return;
    this.idEditando.set(ag.id);
    this.form.patchValue({
      titulo: ag.titulo,
      cliente: ag.cliente ?? '',
      dia: ag.dia,
      horaInicio: ag.horaInicio,
      horaFim: ag.horaFim,
      tipo: ag.tipo,
    });
    this.pAbrir.emit({ modo: 'edicao', item: ag });
    this.modalAgendamento?.open();
  }

  salvar(): void {
    const v = this.form.getRawValue();
    if (!v.titulo.trim()) {
      this.notification.warning('O campo Título é obrigatório.');
      return;
    }
    if (!v.horaInicio || !v.horaFim) {
      this.notification.warning('Informe os horários de início e fim.');
      return;
    }
    // Normaliza horários independente do formato emitido pela máscara
    const item = {
      titulo: v.titulo.trim(),
      cliente: v.cliente.trim(),
      dia: v.dia,
      horaInicio: this.normalizeTime(v.horaInicio),
      horaFim: this.normalizeTime(v.horaFim),
      tipo: v.tipo,
    };

    const idEditando = this.idEditando();
    if (idEditando) {
      const atualizado = { ...item, id: idEditando };
      this.pAgendamentos.update(list => list.map(a => (a.id === idEditando ? atualizado : a)));
      this.pSalvar.emit(atualizado);
      this.notification.success('Agendamento atualizado!');
    } else {
      const novo = { ...item, id: Date.now() };
      this.pAgendamentos.update(list => [...list, novo]);
      this.pSalvar.emit(novo);
      this.notification.success('Agendamento criado!');
    }
    this.modalAgendamento?.close();
  }

  excluir(): void {
    const id = this.idEditando();
    if (id === null) return;
    const item = this.pAgendamentos().find(a => a.id === id);
    this.pAgendamentos.update(list => list.filter(a => a.id !== id));
    if (item) {
      this.pExcluir.emit(item);
    }
    this.notification.success('Agendamento removido.');
    this.modalAgendamento?.close();
  }

  // ── Consultas da grade ──────────────────────────────────────────────────

  /** Item efetivo exibido no bloco (usa a prévia durante o redimensionamento). */
  agendaExibida(ag: AgendaItem): AgendaItem {
    const p = this.resizePreview();
    return p && p.id === ag.id ? p : ag;
  }

  calcTop(horaInicio: string): number {
    const [h, m] = this.normalizeTime(horaInicio).split(':').map(Number);
    return (((h || 0) - this.pHoraInicio()) * 60 + (m || 0)) / 30 * SLOT_HEIGHT;
  }

  calcHeight(horaInicio: string, horaFim: string): number {
    const start = this.timeToMinutes(this.normalizeTime(horaInicio));
    const end = this.timeToMinutes(this.normalizeTime(horaFim));
    const diff = end - start;
    return Math.max((diff / 30) * SLOT_HEIGHT - 2, SLOT_HEIGHT - 2);
  }

  isHoraCheia(h: string): boolean {
    return h.endsWith(':00');
  }

  corTipo(tipo: string): string {
    return this.pTipoOptions().find(o => o.value === tipo)?.color ?? COR_FALLBACK;
  }

  nomeMesAbrev(m: number): string {
    return MESES_ABREV[m - 1] ?? '';
  }

  tooltipMes(dia: DiaCalendario): string {
    return `Ver semana de ${dia.numero}/${this.pad(dia.mes)}/${dia.ano}`;
  }

  // ── Arrastar e soltar ───────────────────────────────────────────────────

  onDragStart(ag: AgendaItem, event: DragEvent): void {
    if (!this.pEditable() || this.resizingId() !== null) {
      event.preventDefault();
      return;
    }
    this.draggingId.set(ag.id);
    event.dataTransfer?.setData('text/plain', String(ag.id));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.draggingId.set(null);
    this.dragOverSlot.set(null);
  }

  onDragOver(dia: string, hora: string, event: DragEvent): void {
    if (!this.pEditable()) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverSlot.set({ dia, hora });
  }

  onDragLeave(): void {
    this.dragOverSlot.set(null);
  }

  onDrop(dia: string, hora: string, event: DragEvent): void {
    event.preventDefault();
    this.dragOverSlot.set(null);
    const draggingId = this.draggingId();
    if (draggingId === null) return;

    const ag = this.pAgendamentos().find(a => a.id === draggingId);
    if (!ag) return;

    const duration = this.timeToMinutes(ag.horaFim) - this.timeToMinutes(ag.horaInicio);
    const movido = { ...ag, dia, horaInicio: hora, horaFim: this.addMinutes(hora, duration) };
    this.pAgendamentos.update(list => list.map(a => (a.id === draggingId ? movido : a)));
    this.pMover.emit(movido);
    this.draggingId.set(null);
    this.notification.success('Agendamento movido!');
  }

  isDragOver(dia: string, hora: string): boolean {
    return this.dragOverSlot()?.dia === dia && this.dragOverSlot()?.hora === hora;
  }

  // ── Redimensionamento (listeners globais via `host`) ────────────────────

  onResizeStart(ag: AgendaItem, type: 'start' | 'end', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.pEditable()) return;
    this.resizingId.set(ag.id);
    this.resizeType.set(type);
    this.resizeStartY = event.clientY;
    this.resizeOrigInicio = ag.horaInicio;
    this.resizeOrigFim = ag.horaFim;
  }

  onResizeMove(event: MouseEvent): void {
    const resizingId = this.resizingId();
    const resizeType = this.resizeType();
    if (resizingId === null || resizeType === null) return;

    const current = this.pAgendamentos().find(a => a.id === resizingId);
    if (!current) return;

    const deltaY = event.clientY - this.resizeStartY;
    const snappedMin = Math.round(deltaY / SLOT_HEIGHT) * 30;

    let horaInicio = current.horaInicio;
    let horaFim = current.horaFim;
    if (resizeType === 'end') {
      const newFimMin = Math.max(
        this.timeToMinutes(this.resizeOrigInicio) + 30,
        Math.min(this.timeToMinutes(this.resizeOrigFim) + snappedMin, this.pHoraFim() * 60),
      );
      horaFim = this.minutesToTime(newFimMin);
    } else {
      const newInicioMin = Math.max(
        this.pHoraInicio() * 60,
        Math.min(this.timeToMinutes(this.resizeOrigInicio) + snappedMin, this.timeToMinutes(this.resizeOrigFim) - 30),
      );
      horaInicio = this.minutesToTime(newInicioMin);
    }
    // Só a prévia é atualizada por mousemove; o modelo é commitado no fim do gesto.
    this.resizePreview.set({ ...current, horaInicio, horaFim });
  }

  onResizeEnd(): void {
    const resizingId = this.resizingId();
    const preview = this.resizePreview();
    this.resizePreview.set(null);
    if (resizingId !== null) {
      if (preview) {
        this.pAgendamentos.update(list => list.map(a => (a.id === resizingId ? preview : a)));
        this.pRedimensionar.emit(preview);
      }
      this.notification.success('Agendamento redimensionado!');
    }
    this.resizingId.set(null);
    this.resizeType.set(null);
  }

  // ── Utilitários ─────────────────────────────────────────────────────────

  private normalizeTime(time: string): string {
    if (!time) return '00:00';
    const clean = time.replace(/\D/g, '');
    if (time.includes(':') && clean.length >= 3) {
      return time.substring(0, 5);
    }
    const digits = clean.padEnd(4, '0');
    return `${digits.substring(0, 2)}:${digits.substring(2, 4)}`;
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return ((h || 0) * 60) + (m || 0);
  }

  private addMinutes(time: string, minutes: number): string {
    const total = this.timeToMinutes(time) + minutes;
    return `${this.pad(Math.min(Math.floor(total / 60), 20))}:${this.pad(total % 60)}`;
  }

  private minutesToTime(totalMin: number): string {
    return `${this.pad(Math.floor(totalMin / 60))}:${this.pad(totalMin % 60)}`;
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
