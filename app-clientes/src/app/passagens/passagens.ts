import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    PoButtonModule,
    PoDividerModule,
    PoFieldModule,
    PoInfoModule,
    PoNotificationService,
    PoPageModule,
    PoStepperModule,
    PoTagModule,
    PoTagType,
    PoWidgetModule,
} from '@po-ui/ng-components';

interface Busca {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: number;
  classe: string;
}

interface Voo {
  id: number;
  companhia: string;
  origem: string;
  destino: string;
  partida: string;
  chegada: string;
  duracao: string;
  escalas: number;
  preco: number;
  foto: string;
}

interface Passageiro {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
}

interface Pagamento {
  metodo: string;
  numeroCartao: string;
  nomeCartao: string;
  validade: string;
  cvv: string;
  parcelas: string;
}

@Component({
  selector: 'app-passagens',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoStepperModule,
    PoWidgetModule,
    PoTagModule,
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

  passoAtual = 1;

  passos = [
    { label: 'Busca' },
    { label: 'Escolha o Voo' },
    { label: 'Passageiro' },
    { label: 'Pagamento' },
    { label: 'Confirmação' },
  ];

  busca: Busca = {
    origem: '',
    destino: '',
    dataIda: '',
    dataVolta: '',
    passageiros: 1,
    classe: 'economy',
  };

  vooSelecionado: Voo | null = null;

  passageiro: Passageiro = {
    nome: '',
    sobrenome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
  };

  pagamento: Pagamento = {
    metodo: 'credito',
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
    parcelas: '1',
  };

  codigoReserva = '';

  aeroportos = [
    { value: 'GRU', label: 'São Paulo - Guarulhos (GRU)' },
    { value: 'CGH', label: 'São Paulo - Congonhas (CGH)' },
    { value: 'GIG', label: 'Rio de Janeiro - Galeão (GIG)' },
    { value: 'SDU', label: 'Rio de Janeiro - Santos Dumont (SDU)' },
    { value: 'BSB', label: 'Brasília (BSB)' },
    { value: 'SSA', label: 'Salvador (SSA)' },
    { value: 'FOR', label: 'Fortaleza (FOR)' },
    { value: 'REC', label: 'Recife (REC)' },
    { value: 'MAO', label: 'Manaus (MAO)' },
    { value: 'POA', label: 'Porto Alegre (POA)' },
    { value: 'CNF', label: 'Belo Horizonte - Confins (CNF)' },
    { value: 'CWB', label: 'Curitiba (CWB)' },
    { value: 'FLN', label: 'Florianópolis (FLN)' },
    { value: 'MCZ', label: 'Maceió (MCZ)' },
    { value: 'NAT', label: 'Natal (NAT)' },
  ];

  classeOpcoes = [
    { value: 'economy', label: 'Econômica' },
    { value: 'premium_economy', label: 'Econômica Premium' },
    { value: 'business', label: 'Executiva' },
    { value: 'first', label: 'Primeira Classe' },
  ];

  passageirosOpcoes = [
    { value: 1, label: '1 Passageiro' },
    { value: 2, label: '2 Passageiros' },
    { value: 3, label: '3 Passageiros' },
    { value: 4, label: '4 Passageiros' },
    { value: 5, label: '5 Passageiros' },
    { value: 6, label: '6 Passageiros' },
  ];

  metodoPagamentoOpcoes = [
    { value: 'credito', label: 'Cartão de Crédito' },
    { value: 'debito', label: 'Cartão de Débito' },
    { value: 'pix', label: 'PIX' },
  ];

  parcelasOpcoes = [
    { value: '1', label: '1x sem juros' },
    { value: '2', label: '2x sem juros' },
    { value: '3', label: '3x sem juros' },
    { value: '6', label: '6x + juros' },
    { value: '12', label: '12x + juros' },
  ];

  voosDisponiveis: Voo[] = [
    {
      id: 1,
      companhia: 'LATAM Airlines',
      origem: 'GRU',
      destino: 'SSA',
      partida: '07:30',
      chegada: '09:50',
      duracao: '2h 20min',
      escalas: 0,
      preco: 489,
      foto: 'https://picsum.photos/seed/salvador-beach-101/800/260',
    },
    {
      id: 2,
      companhia: 'GOL Linhas Aéreas',
      origem: 'GRU',
      destino: 'SSA',
      partida: '10:15',
      chegada: '12:45',
      duracao: '2h 30min',
      escalas: 0,
      preco: 412,
      foto: 'https://picsum.photos/seed/bahia-coast-202/800/260',
    },
    {
      id: 3,
      companhia: 'Azul Linhas Aéreas',
      origem: 'GRU',
      destino: 'SSA',
      partida: '14:00',
      chegada: '17:30',
      duracao: '3h 30min',
      escalas: 1,
      preco: 298,
      foto: 'https://picsum.photos/seed/beach-sunset-303/800/260',
    },
    {
      id: 4,
      companhia: 'LATAM Airlines',
      origem: 'GRU',
      destino: 'SSA',
      partida: '18:45',
      chegada: '21:10',
      duracao: '2h 25min',
      escalas: 0,
      preco: 567,
      foto: 'https://picsum.photos/seed/tropical-bay-404/800/260',
    },
  ];

  destinos = [
    {
      cidade: 'Salvador',
      codigo: 'SSA',
      descricao: 'A capital da alegria',
      preco: 'A partir de R$ 298',
      foto: 'https://picsum.photos/seed/salvador-city-11/600/360',
    },
    {
      cidade: 'Fortaleza',
      codigo: 'FOR',
      descricao: 'Sol e praias incríveis',
      preco: 'A partir de R$ 399',
      foto: 'https://picsum.photos/seed/fortaleza-coast-22/600/360',
    },
    {
      cidade: 'Rio de Janeiro',
      codigo: 'GIG',
      descricao: 'A cidade maravilhosa',
      preco: 'A partir de R$ 249',
      foto: 'https://picsum.photos/seed/rio-janeiro-33/600/360',
    },
    {
      cidade: 'Manaus',
      codigo: 'MAO',
      descricao: 'Porta de entrada da Amazônia',
      preco: 'A partir de R$ 589',
      foto: 'https://picsum.photos/seed/amazon-jungle-44/600/360',
    },
    {
      cidade: 'Florianópolis',
      codigo: 'FLN',
      descricao: 'A ilha da magia',
      preco: 'A partir de R$ 312',
      foto: 'https://picsum.photos/seed/floripa-island-55/600/360',
    },
    {
      cidade: 'Recife',
      codigo: 'REC',
      descricao: 'Cultura e praias maravilhosas',
      preco: 'A partir de R$ 378',
      foto: 'https://picsum.photos/seed/recife-praia-66/600/360',
    },
  ];

  buscarVoos(): void {
    this.passoAtual = 2;
  }

  selecionarDestinoDestaque(codigo: string): void {
    this.busca.destino = codigo;
    this.passoAtual = 2;
  }

  selecionarVoo(voo: Voo): void {
    this.vooSelecionado = voo;
    this.passoAtual = 3;
  }

  avancarParaPagamento(): void {
    this.passoAtual = 4;
  }

  confirmarPagamento(): void {
    this.codigoReserva = 'BR' + Math.floor(Math.random() * 900000 + 100000).toString();
    this.passoAtual = 5;
  }

  voltarPasso(): void {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  novaCompra(): void {
    this.passoAtual = 1;
    this.vooSelecionado = null;
    this.busca = { origem: '', destino: '', dataIda: '', dataVolta: '', passageiros: 1, classe: 'economy' };
    this.passageiro = { nome: '', sobrenome: '', cpf: '', email: '', telefone: '', dataNascimento: '' };
    this.pagamento = { metodo: 'credito', numeroCartao: '', nomeCartao: '', validade: '', cvv: '', parcelas: '1' };
    this.codigoReserva = '';
  }

  getAeroportoLabel(code: string): string {
    return this.aeroportos.find(a => a.value === code)?.label ?? code;
  }

  getClasseLabel(value: string): string {
    return this.classeOpcoes.find(c => c.value === value)?.label ?? value;
  }

  getMetodoPagamentoLabel(value: string): string {
    return this.metodoPagamentoOpcoes.find(m => m.value === value)?.label ?? value;
  }

  getTotalPassagem(): number {
    return (this.vooSelecionado?.preco ?? 0) * this.busca.passageiros;
  }
}
