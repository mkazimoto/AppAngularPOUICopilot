import { DecimalPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    PoButtonModule,
    PoDividerModule,
    PoFieldModule,
    PoInfoModule,
    PoModalAction,
    PoModalComponent,
    PoModalModule,
    PoNotificationService,
    PoPageModule,
    PoTagModule,
    PoTagType,
    PoWidgetModule,
} from '@po-ui/ng-components';

interface Voo {
  id: number;
  companhia: string;
  origem: string;
  destino: string;
  partida: string;
  chegada: string;
  duracao: string;
  preco: number;
  classe: string;
  escalas: number;
  foto: string;
}

@Component({
  selector: 'app-passagens',
  imports: [
    DecimalPipe,
    FormsModule,
    PoPageModule,
    PoWidgetModule,
    PoTagModule,
    PoModalModule,
    PoButtonModule,
    PoInfoModule,
    PoFieldModule,
    PoDividerModule,
  ],
  templateUrl: './passagens.html',
  styleUrl: './passagens.css',
  providers: [PoNotificationService],
})
export class Passagens {
  readonly PoTagType = PoTagType;

  @ViewChild('modalReserva') modalReserva!: PoModalComponent;

  vooSelecionado: Voo | null = null;
  filtroOrigem = '';
  filtroDestino = '';

  nomePassageiro = '';
  cpfPassageiro = '';
  emailPassageiro = '';

  origemOpcoes = [
    { value: '', label: 'Todas as origens' },
    { value: 'GRU', label: 'São Paulo (GRU)' },
    { value: 'GIG', label: 'Rio de Janeiro (GIG)' },
    { value: 'BSB', label: 'Brasília (BSB)' },
    { value: 'SSA', label: 'Salvador (SSA)' },
    { value: 'FOR', label: 'Fortaleza (FOR)' },
  ];

  destinoOpcoes = [
    { value: '', label: 'Todos os destinos' },
    { value: 'MIA', label: 'Miami (MIA)' },
    { value: 'LIS', label: 'Lisboa (LIS)' },
    { value: 'CDG', label: 'Paris (CDG)' },
    { value: 'GRU', label: 'São Paulo (GRU)' },
    { value: 'CWB', label: 'Curitiba (CWB)' },
    { value: 'FLN', label: 'Florianópolis (FLN)' },
  ];

  voos: Voo[] = [
    {
      id: 1,
      companhia: 'LATAM Airlines',
      origem: 'GRU',
      destino: 'MIA',
      partida: '08:00',
      chegada: '16:30',
      duracao: '9h 30min',
      preco: 2850,
      classe: 'Econômica',
      escalas: 0,
      foto: 'https://picsum.photos/seed/miami-beach/600/300',
    },
    {
      id: 2,
      companhia: 'TAP Air Portugal',
      origem: 'GRU',
      destino: 'LIS',
      partida: '23:45',
      chegada: '13:15',
      duracao: '9h 30min',
      preco: 3400,
      classe: 'Econômica',
      escalas: 0,
      foto: 'https://picsum.photos/seed/lisbon-city/600/300',
    },
    {
      id: 3,
      companhia: 'Air France',
      origem: 'GIG',
      destino: 'CDG',
      partida: '21:10',
      chegada: '12:40',
      duracao: '11h 30min',
      preco: 4100,
      classe: 'Business',
      escalas: 0,
      foto: 'https://picsum.photos/seed/paris-tower/600/300',
    },
    {
      id: 4,
      companhia: 'Gol Linhas Aéreas',
      origem: 'BSB',
      destino: 'GRU',
      partida: '06:30',
      chegada: '08:05',
      duracao: '1h 35min',
      preco: 490,
      classe: 'Econômica',
      escalas: 0,
      foto: 'https://picsum.photos/seed/sao-paulo-skyline/600/300',
    },
    {
      id: 5,
      companhia: 'Azul Linhas Aéreas',
      origem: 'SSA',
      destino: 'CWB',
      partida: '11:20',
      chegada: '14:50',
      duracao: '3h 30min',
      preco: 780,
      classe: 'Econômica',
      escalas: 1,
      foto: 'https://picsum.photos/seed/curitiba-city/600/300',
    },
    {
      id: 6,
      companhia: 'LATAM Airlines',
      origem: 'FOR',
      destino: 'FLN',
      partida: '07:45',
      chegada: '11:30',
      duracao: '3h 45min',
      preco: 650,
      classe: 'Econômica',
      escalas: 1,
      foto: 'https://picsum.photos/seed/florianopolis-beach/600/300',
    },
    {
      id: 7,
      companhia: 'Emirates',
      origem: 'GRU',
      destino: 'CDG',
      partida: '14:00',
      chegada: '09:30',
      duracao: '14h 30min',
      preco: 5200,
      classe: 'Business',
      escalas: 1,
      foto: 'https://picsum.photos/seed/paris-louvre/600/300',
    },
    {
      id: 8,
      companhia: 'American Airlines',
      origem: 'GIG',
      destino: 'MIA',
      partida: '09:55',
      chegada: '17:20',
      duracao: '7h 25min',
      preco: 3100,
      classe: 'Econômica',
      escalas: 0,
      foto: 'https://picsum.photos/seed/miami-port/600/300',
    },
  ];

  get voosFiltrados(): Voo[] {
    return this.voos.filter(
      (v) =>
        (!this.filtroOrigem || v.origem === this.filtroOrigem) &&
        (!this.filtroDestino || v.destino === this.filtroDestino),
    );
  }

  abrirModal(voo: Voo): void {
    this.vooSelecionado = voo;
    this.nomePassageiro = '';
    this.cpfPassageiro = '';
    this.emailPassageiro = '';
    this.modalReserva.open();
  }

  confirmarReservaAcao: PoModalAction = {
    label: 'Confirmar Reserva',
    action: () => this.confirmarReserva(),
  };

  cancelarAcao: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalReserva.close(),
  };

  private confirmarReserva(): void {
    if (!this.nomePassageiro || !this.cpfPassageiro || !this.emailPassageiro) {
      return;
    }
    this.modalReserva.close();
  }

  getOrigemLabel(codigo: string): string {
    return this.origemOpcoes.find((o) => o.value === codigo)?.label ?? codigo;
  }

  getDestinoLabel(codigo: string): string {
    return this.destinoOpcoes.find((o) => o.value === codigo)?.label ?? codigo;
  }

  getEscalasLabel(escalas: number): string {
    if (escalas === 0) return 'Voo Direto';
    if (escalas === 1) return '1 Escala';
    return `${escalas} Escalas`;
  }
}
