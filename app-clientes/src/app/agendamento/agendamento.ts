import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    PoButtonModule,
    PoFieldModule,
    PoModalAction,
    PoModalComponent,
    PoModalModule,
    PoNotificationService,
    PoPageModule,
    PoSelectOption,
    PoTagModule,
} from '@po-ui/ng-components';

export interface AgendamentoItem {
  id: number;
  titulo: string;
  cliente: string;
  dia: string;       // 'YYYY-MM-DD'
  horaInicio: string; // 'HH:MM'
  horaFim: string;   // 'HH:MM'
  tipo: string;
}

export interface DiaCalendario {
  date: string;
  diaSemana: string;
  numero: number;
  mes: number;
  ano: number;
  isHoje: boolean;
}

interface AgendamentoForm {
  titulo: string;
  cliente: string;
  dia: string;
  horaInicio: string;
  horaFim: string;
  tipo: string;
}

@Component({
  selector: 'app-agendamento',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoButtonModule,
    PoModalModule,
    PoTagModule,
    PoFieldModule,
  ],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css',
})
export class Agendamento implements OnInit {
  @ViewChild('modalAgendamento') modalAgendamento!: PoModalComponent;

  private weekStart: Date = new Date();

  readonly SLOT_HEIGHT = 48; // px per 30-min slot
  readonly HORA_INICIO = 7;

  dias: DiaCalendario[] = [];
  horarios: string[] = [];
  agendamentos: AgendamentoItem[] = [];

  idEditando: number | null = null;
  draggingId: number | null = null;
  dragOverSlot: { dia: string; hora: string } | null = null;

  resizingId: number | null = null;
  resizeType: 'start' | 'end' | null = null;
  private resizeStartY = 0;
  private resizeOrigInicio = '';
  private resizeOrigFim = '';

  formItem: AgendamentoForm = this.criarFormVazio();

  tipoOptions: PoSelectOption[] = [
    { label: 'Consulta', value: 'consulta' },
    { label: 'Reunião', value: 'reuniao' },
    { label: 'Serviço', value: 'servico' },
    { label: 'Entrevista', value: 'entrevista' },
  ];

  pageActions = [
    { label: 'Novo Agendamento', action: () => this.abrirNovoAgendamento(this.dias[0]?.date ?? '', '08:00'), icon: 'an an-plus' },
  ];

  confirmAction: PoModalAction = {
    label: 'Salvar',
    action: () => this.salvar(),
  };

  cancelAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalAgendamento.close(),
  };

  get titleModal(): string {
    return this.idEditando ? 'Editar Agendamento' : 'Novo Agendamento';
  }

  get labelSemana(): string {
    if (this.dias.length === 0) return '';
    const p = this.dias[0];
    const u = this.dias[6];
    if (p.mes === u.mes) {
      return `${p.numero}–${u.numero} de ${this.nomeMes(p.mes)} de ${p.ano}`;
    }
    return `${p.numero}/${this.pad(p.mes)} – ${u.numero}/${this.pad(u.mes)} de ${p.ano}`;
  }

  constructor(private notification: PoNotificationService) {}

  ngOnInit(): void {
    this.gerarHorarios();
    this.navegarParaHoje();
    this.popularDadosExemplo();
  }

  gerarHorarios(): void {
    this.horarios = [];
    for (let h = this.HORA_INICIO; h <= 20; h++) {
      this.horarios.push(`${this.pad(h)}:00`);
      if (h < 20) {
        this.horarios.push(`${this.pad(h)}:30`);
      }
    }
  }

  gerarSemana(): void {
    this.dias = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStart);
      d.setDate(this.weekStart.getDate() + i);
      d.setHours(0, 0, 0, 0);
      this.dias.push({
        date: this.formatDate(d),
        diaSemana: nomes[d.getDay()],
        numero: d.getDate(),
        mes: d.getMonth() + 1,
        ano: d.getFullYear(),
        isHoje: d.getTime() === hoje.getTime(),
      });
    }
  }

  navegarParaHoje(): void {
    const hoje = new Date();
    const dow = hoje.getDay();
    const offset = dow === 0 ? -6 : 1 - dow;
    this.weekStart = new Date(hoje);
    this.weekStart.setDate(hoje.getDate() + offset);
    this.weekStart.setHours(0, 0, 0, 0);
    this.gerarSemana();
  }

  navAnterior(): void {
    this.weekStart = new Date(this.weekStart);
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.gerarSemana();
  }

  navProxima(): void {
    this.weekStart = new Date(this.weekStart);
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.gerarSemana();
  }

  abrirNovoAgendamento(dia: string, hora: string): void {
    this.idEditando = null;
    this.formItem = {
      titulo: '',
      cliente: '',
      dia,
      horaInicio: hora,
      horaFim: this.addMinutes(hora, 60),
      tipo: 'consulta',
    };
    this.modalAgendamento.open();
  }

  abrirEdicao(ag: AgendamentoItem, event: MouseEvent): void {
    event.stopPropagation();
    this.idEditando = ag.id;
    this.formItem = {
      titulo: ag.titulo,
      cliente: ag.cliente,
      dia: ag.dia,
      horaInicio: ag.horaInicio,
      horaFim: ag.horaFim,
      tipo: ag.tipo,
    };
    this.modalAgendamento.open();
  }

  salvar(): void {
    if (!this.formItem.titulo?.trim()) {
      this.notification.warning('O campo Título é obrigatório.');
      return;
    }
    if (!this.formItem.horaInicio || !this.formItem.horaFim) {
      this.notification.warning('Informe os horários de início e fim.');
      return;
    }
    // Normaliza horários independente do formato emitido pela máscara
    const horaInicio = this.normalizeTime(this.formItem.horaInicio);
    const horaFim    = this.normalizeTime(this.formItem.horaFim);
    const itemNorm   = { ...this.formItem, horaInicio, horaFim };

    if (this.idEditando) {
      const id = this.idEditando;
      this.agendamentos = this.agendamentos.map(a =>
        a.id === id ? { ...itemNorm, id } : a
      );
      this.notification.success('Agendamento atualizado!');
    } else {
      this.agendamentos = [
        ...this.agendamentos,
        { ...itemNorm, id: Date.now() },
      ];
      this.notification.success('Agendamento criado!');
    }
    this.modalAgendamento.close();
  }

  excluir(): void {
    if (this.idEditando) {
      this.agendamentos = this.agendamentos.filter(a => a.id !== this.idEditando);
      this.notification.success('Agendamento removido.');
      this.modalAgendamento.close();
    }
  }

  getAgendamentosDia(dia: string): AgendamentoItem[] {
    return this.agendamentos.filter(a => a.dia === dia);
  }

  getAgendamentosNasCelula(dia: string, hora: string): boolean {
    return this.agendamentos.some(a => a.dia === dia && a.horaInicio === hora);
  }

  calcTop(horaInicio: string): number {
    const norm = this.normalizeTime(horaInicio);
    const [h, m] = norm.split(':').map(Number);
    const totalMin = ((h || 0) - this.HORA_INICIO) * 60 + (m || 0);
    return (totalMin / 30) * this.SLOT_HEIGHT;
  }

  calcHeight(horaInicio: string, horaFim: string): number {
    const start = this.timeToMinutes(this.normalizeTime(horaInicio));
    const end   = this.timeToMinutes(this.normalizeTime(horaFim));
    const diff  = end - start;
    return Math.max((diff / 30) * this.SLOT_HEIGHT - 2, this.SLOT_HEIGHT - 2);
  }

  calcTopSafe(horaInicio: string): number {
    return this.calcTop(this.normalizeTime(horaInicio));
  }

  trackAgendamento(_: number, ag: AgendamentoItem): number {
    return ag.id;
  }

  onDragStart(ag: AgendamentoItem, event: DragEvent): void {
    if (this.resizingId !== null) {
      event.preventDefault();
      return;
    }
    this.draggingId = ag.id;
    event.dataTransfer?.setData('text/plain', String(ag.id));
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragEnd(): void {
    this.draggingId = null;
    this.dragOverSlot = null;
  }

  onDragOver(dia: string, hora: string, event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverSlot = { dia, hora };
  }

  onDragLeave(): void {
    this.dragOverSlot = null;
  }

  onDrop(dia: string, hora: string, event: DragEvent): void {
    event.preventDefault();
    this.dragOverSlot = null;
    if (this.draggingId === null) return;

    const ag = this.agendamentos.find(a => a.id === this.draggingId);
    if (!ag) return;

    const duration = this.timeToMinutes(ag.horaFim) - this.timeToMinutes(ag.horaInicio);
    const novoFim = this.addMinutes(hora, duration);

    this.agendamentos = this.agendamentos.map(a =>
      a.id === this.draggingId ? { ...a, dia, horaInicio: hora, horaFim: novoFim } : a
    );
    this.draggingId = null;
    this.notification.success('Agendamento movido!');
  }

  isDragOver(dia: string, hora: string): boolean {
    return this.dragOverSlot?.dia === dia && this.dragOverSlot?.hora === hora;
  }

  onResizeStart(ag: AgendamentoItem, type: 'start' | 'end', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.resizingId = ag.id;
    this.resizeType = type;
    this.resizeStartY = event.clientY;
    this.resizeOrigInicio = ag.horaInicio;
    this.resizeOrigFim = ag.horaFim;
  }

  @HostListener('document:mousemove', ['$event'])
  onResizeMove(event: MouseEvent): void {
    if (this.resizingId === null || this.resizeType === null) return;
    const deltaY = event.clientY - this.resizeStartY;
    const snappedMin = Math.round(deltaY / this.SLOT_HEIGHT) * 30;
    this.agendamentos = this.agendamentos.map(a => {
      if (a.id !== this.resizingId) return a;
      if (this.resizeType === 'end') {
        const newFimMin = Math.max(
          this.timeToMinutes(this.resizeOrigInicio) + 30,
          Math.min(this.timeToMinutes(this.resizeOrigFim) + snappedMin, 20 * 60)
        );
        return { ...a, horaFim: this.minutesToTime(newFimMin) };
      } else {
        const newInicioMin = Math.max(
          this.HORA_INICIO * 60,
          Math.min(this.timeToMinutes(this.resizeOrigInicio) + snappedMin, this.timeToMinutes(this.resizeOrigFim) - 30)
        );
        return { ...a, horaInicio: this.minutesToTime(newInicioMin) };
      }
    });
  }

  @HostListener('document:mouseup')
  onResizeEnd(): void {
    if (this.resizingId !== null) {
      this.notification.success('Agendamento redimensionado!');
    }
    this.resizingId = null;
    this.resizeType = null;
  }

  labelTipo(tipo: string): string {
    const opt = this.tipoOptions.find(o => o.value === tipo);
    return opt ? String(opt.label) : tipo;
  }

  isHoraCheia(h: string): boolean {
    return h.endsWith(':00');
  }

  private criarFormVazio(): AgendamentoForm {
    return { titulo: '', cliente: '', dia: '', horaInicio: '', horaFim: '', tipo: 'consulta' };
  }

  private normalizeTime(time: string): string {
    if (!time) return '00:00';
    const clean = time.replace(/\D/g, '');
    if (time.includes(':') && clean.length >= 3) {
      // already formatted as HH:MM
      return time.substring(0, 5);
    }
    // raw digits from mask (e.g. '1030' → '10:30')
    const digits = clean.padEnd(4, '0');
    return `${digits.substring(0, 2)}:${digits.substring(2, 4)}`;
  }

  private timeToMinutes(time: string): number {
    const parts = time.split(':');
    const h = parseInt(parts[0] ?? '0', 10) || 0;
    const m = parseInt(parts[1] ?? '0', 10) || 0;
    return h * 60 + m;
  }

  private addMinutes(time: string, minutes: number): string {
    const total = this.timeToMinutes(time) + minutes;
    const h = Math.min(Math.floor(total / 60), 20);
    const m = total % 60;
    return `${this.pad(h)}:${this.pad(m)}`;
  }

  private minutesToTime(totalMin: number): string {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${this.pad(h)}:${this.pad(m)}`;
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private nomeMes(m: number): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    return meses[m - 1];
  }

  private popularDadosExemplo(): void {
    if (this.dias.length < 7) return;
    const seg = this.dias.find(d => d.diaSemana === 'Seg')?.date ?? '';
    const ter = this.dias.find(d => d.diaSemana === 'Ter')?.date ?? '';
    const qua = this.dias.find(d => d.diaSemana === 'Qua')?.date ?? '';
    const qui = this.dias.find(d => d.diaSemana === 'Qui')?.date ?? '';
    const sex = this.dias.find(d => d.diaSemana === 'Sex')?.date ?? '';

    this.agendamentos = [
      { id: 1,  titulo: 'Consulta Dr. Silva',     cliente: 'João Santos',    dia: seg, horaInicio: '08:00', horaFim: '09:00', tipo: 'consulta'   },
      { id: 2,  titulo: 'Reunião de Equipe',       cliente: 'Toda Equipe',    dia: seg, horaInicio: '10:00', horaFim: '11:30', tipo: 'reuniao'    },
      { id: 3,  titulo: 'Manutenção PC',           cliente: 'Ana Lima',       dia: ter, horaInicio: '09:00', horaFim: '10:00', tipo: 'servico'    },
      { id: 4,  titulo: 'Entrevista Dev Sr.',      cliente: 'Carlos Souza',   dia: ter, horaInicio: '14:00', horaFim: '15:00', tipo: 'entrevista' },
      { id: 5,  titulo: 'Revisão do Projeto',      cliente: 'Maria Oliveira', dia: qua, horaInicio: '09:30', horaFim: '10:30', tipo: 'reuniao'    },
      { id: 6,  titulo: 'Consulta Retorno',        cliente: 'Pedro Costa',    dia: qua, horaInicio: '14:30', horaFim: '15:00', tipo: 'consulta'   },
      { id: 7,  titulo: 'Instalação de Software',  cliente: 'Firm Tech',      dia: qui, horaInicio: '08:30', horaFim: '10:00', tipo: 'servico'    },
      { id: 8,  titulo: 'Sprint Planning',         cliente: 'Equipe Dev',     dia: qui, horaInicio: '13:00', horaFim: '14:00', tipo: 'reuniao'    },
      { id: 9,  titulo: 'Entrevista UX Designer',  cliente: 'Lucia Ferreira', dia: sex, horaInicio: '10:00', horaFim: '11:00', tipo: 'entrevista' },
      { id: 10, titulo: 'Fechamento Semanal',      cliente: 'Gestores',       dia: sex, horaInicio: '16:00', horaFim: '17:00', tipo: 'reuniao'    },
    ];
  }
}
