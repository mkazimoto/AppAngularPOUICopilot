import { Component } from '@angular/core';
import { PoPageModule } from '@po-ui/ng-components';
import {
  AgendaAbrirEvent,
  AgendaItem,
  AgendaTipoOpcao,
  AgendaViewerComponent,
} from './agenda-viewer/agenda-viewer.component';

@Component({
  selector: 'app-agendamento',
  imports: [PoPageModule, AgendaViewerComponent],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css',
})
export class Agendamento {
  agendamentos: AgendaItem[] = [];

  readonly tipoOptions: AgendaTipoOpcao[] = [
    { label: 'Consulta', value: 'consulta', color: '#1e88e5' },
    { label: 'Reunião', value: 'reuniao', color: '#43a047' },
    { label: 'Serviço', value: 'servico', color: '#fb8c00' },
    { label: 'Entrevista', value: 'entrevista', color: '#8e24aa' },
  ];

  constructor() {
    this.popularDadosExemplo();
  }

  /** Gancho de integração: chamado ao abrir a modal de criação/edição. */
  onAbrir(event: AgendaAbrirEvent): void {
    console.info('agendamento:abrir', event);
  }

  /** Gancho de integração: chamado ao criar/atualizar um agendamento. */
  onSalvar(item: AgendaItem): void {
    console.info('agendamento:salvar', item);
  }

  /** Gancho de integração: chamado ao excluir um agendamento. */
  onExcluir(item: AgendaItem): void {
    console.info('agendamento:excluir', item);
  }

  /** Gancho de integração: chamado ao mover um agendamento. */
  onMover(item: AgendaItem): void {
    console.info('agendamento:mover', item);
  }

  /** Gancho de integração: chamado ao redimensionar um agendamento. */
  onRedimensionar(item: AgendaItem): void {
    console.info('agendamento:redimensionar', item);
  }

  private popularDadosExemplo(): void {
    const [seg, ter, qua, qui, sex] = [0, 1, 2, 3, 4].map(i => this.diaSemana(i));
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

  private diaSemana(offset: number): string {
    const hoje = new Date();
    const inicio = hoje.getDay() === 0 ? -6 : 1 - hoje.getDay();
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + inicio + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

