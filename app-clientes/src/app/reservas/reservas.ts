import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoDividerModule,
  PoInfoModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoSlideItem,
  PoSlideModule,
  PoTagModule,
  PoTagType,
  PoWidgetModule,
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoStepperModule,
  PoStepperOrientation,
} from '@po-ui/ng-components';

export interface Hotel {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  pais: string;
  estrelas: number;
  categoria: string;
  categoriaTag: PoTagType;
  precoPorNoite: number;
  descricao: string;
  comodidades: string[];
  fotos: string[];
  destaque: boolean;
  disponivel: boolean;
  avaliacao: number;
  totalAvaliacoes: number;
}

export interface ReservaForm {
  nomeHospede: string;
  email: string;
  telefone: string;
  checkIn: string;
  checkOut: string;
  adultos: number;
  criancas: number;
  tipoQuarto: string;
  observacoes: string;
}

@Component({
  selector: 'app-reservas',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoWidgetModule,
    PoSlideModule,
    PoTagModule,
    PoModalModule,
    PoInfoModule,
    PoDividerModule,
    PoButtonModule,
    PoFieldModule,
    PoStepperModule,
  ],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css'],
})
export class Reservas implements OnInit {
  @ViewChild('modalHotel') modalHotel!: PoModalComponent;
  @ViewChild('modalReserva') modalReserva!: PoModalComponent;

  readonly PoTagType = PoTagType;
  readonly PoStepperOrientation = PoStepperOrientation;

  hotelSelecionado: Hotel | null = null;
  filtroAtivo = 'todos';
  stepperAtivo = 1;

  reservaForm: ReservaForm = {
    nomeHospede: '',
    email: '',
    telefone: '',
    checkIn: '',
    checkOut: '',
    adultos: 1,
    criancas: 0,
    tipoQuarto: 'standard',
    observacoes: '',
  };

  slidesDestaque: PoSlideItem[] = [];

  readonly tiposQuarto = [
    { label: 'Standard', value: 'standard' },
    { label: 'Superior', value: 'superior' },
    { label: 'Deluxe', value: 'deluxe' },
    { label: 'Suite', value: 'suite' },
    { label: 'Suite Presidential', value: 'presidential' },
  ];

  readonly hoteis: Hotel[] = [
    {
      id: 1,
      nome: 'Grand Palace Hotel & Spa',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil',
      estrelas: 5,
      categoria: 'Luxo',
      categoriaTag: PoTagType.Success,
      precoPorNoite: 1280,
      descricao:
        'Hotel cinco estrelas à beira-mar com vista privilegiada para o Pão de Açúcar. Oferece spa completo, piscinas aquecidas, restaurante gourmet e serviço de concierge 24 horas.',
      comodidades: ['Wi-Fi', 'Spa', 'Piscina', 'Academia', 'Restaurante', 'Bar', 'Estacionamento', 'Transfer Airport'],
      fotos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      ],
      destaque: true,
      disponivel: true,
      avaliacao: 4.9,
      totalAvaliacoes: 2435,
    },
    {
      id: 2,
      nome: 'Copacabana Beach Resort',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil',
      estrelas: 4,
      categoria: 'Resort',
      categoriaTag: PoTagType.Info,
      precoPorNoite: 680,
      descricao:
        'Resort na orla de Copacabana com acesso direto à praia. Quartos amplos com varanda, piscina com borda infinita e clube infantil para a família.',
      comodidades: ['Wi-Fi', 'Piscina', 'Praia Privativa', 'Clube Infantil', 'Restaurante', 'Bar Molhado', 'Spa'],
      fotos: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
        'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
      ],
      destaque: true,
      disponivel: true,
      avaliacao: 4.7,
      totalAvaliacoes: 1890,
    },
    {
      id: 3,
      nome: 'Boutique Vila Histórica',
      cidade: 'Paraty',
      estado: 'RJ',
      pais: 'Brasil',
      estrelas: 4,
      categoria: 'Boutique',
      categoriaTag: PoTagType.Warning,
      precoPorNoite: 420,
      descricao:
        'Encantador hotel boutique no centro histórico de Paraty. Edificação colonial do século XVIII com decoração artesanal, jardim tropical e café da manhã colonial.',
      comodidades: ['Wi-Fi', 'Café da Manhã', 'Jardim', 'Varanda', 'Biblioteca', 'Bicicletas Gratuitas'],
      fotos: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      ],
      destaque: false,
      disponivel: true,
      avaliacao: 4.8,
      totalAvaliacoes: 743,
    },
    {
      id: 4,
      nome: 'Serra Verde Eco Lodge',
      cidade: 'Visconde de Mauá',
      estado: 'RJ',
      pais: 'Brasil',
      estrelas: 3,
      categoria: 'Ecoturismo',
      categoriaTag: PoTagType.Success,
      precoPorNoite: 280,
      descricao:
        'Eco lodge sustentável na Serra da Mantiqueira. Chalés de madeira com lareira, trilhas ecológicas, cachoeiras e gastronomia orgânica. Ideal para quem busca contato com a natureza.',
      comodidades: ['Wi-Fi', 'Café da Manhã Orgânico', 'Trilhas', 'Lareira', 'Ofurô', 'Pesque & Solte'],
      fotos: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
      ],
      destaque: false,
      disponivel: true,
      avaliacao: 4.6,
      totalAvaliacoes: 512,
    },
    {
      id: 5,
      nome: 'Metropolitan Business Hotel',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil',
      estrelas: 4,
      categoria: 'Business',
      categoriaTag: PoTagType.Neutral,
      precoPorNoite: 390,
      descricao:
        'Hotel executivo na Av. Paulista com centro de convenções, salas de reunião equipadas e serviço de transporte para aeroportto. Ideal para viagens corporativas.',
      comodidades: ['Wi-Fi Alta Velocidade', 'Centro de Convenções', 'Academia', 'Restaurante', 'Lavanderia', 'Business Center'],
      fotos: [
        'https://images.unsplash.com/photo-1551361415-69c87624334f?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      ],
      destaque: false,
      disponivel: true,
      avaliacao: 4.4,
      totalAvaliacoes: 1234,
    },
    {
      id: 6,
      nome: 'Amazônia Jungle Hotel',
      cidade: 'Manaus',
      estado: 'AM',
      pais: 'Brasil',
      estrelas: 5,
      categoria: 'Luxo',
      categoriaTag: PoTagType.Success,
      precoPorNoite: 1650,
      descricao:
        'Experiência única no coração da floresta amazônica. Bangalôs flutuantes sobre o Rio Negro, passeios de canoa, observação de fauna e flora, e culinária amazônica exclusiva.',
      comodidades: ['Wi-Fi', 'Passeios Guiados', 'Bangalô Flutuante', 'Transfer Fluvial', 'Gastronomia Regional', 'Observação Noturna'],
      fotos: [
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80',
        'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      ],
      destaque: true,
      disponivel: false,
      avaliacao: 4.9,
      totalAvaliacoes: 387,
    },
  ];

  get hoteisFiltrados(): Hotel[] {
    switch (this.filtroAtivo) {
      case 'luxo':
        return this.hoteis.filter(h => h.categoria === 'Luxo');
      case 'resort':
        return this.hoteis.filter(h => h.categoria === 'Resort');
      case 'boutique':
        return this.hoteis.filter(h => h.categoria === 'Boutique');
      case 'disponiveis':
        return this.hoteis.filter(h => h.disponivel);
      case 'destaque':
        return this.hoteis.filter(h => h.destaque);
      default:
        return this.hoteis;
    }
  }

  readonly acaoVerDetalhes: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalHotel.close(),
  };

  readonly acaoConfirmarReserva: PoModalAction = {
    label: 'Confirmar Reserva',
    action: () => this.confirmarReserva(),
  };

  readonly acaoCancelarReserva: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalReserva.close(),
    danger: true,
  };

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit(): void {
    this.slidesDestaque = this.hoteis
      .filter(h => h.destaque)
      .flatMap(h =>
        h.fotos.slice(0, 1).map(foto => ({
          image: foto,
          description: `${h.nome} — ${h.cidade}/${h.estado} — A partir de R$ ${h.precoPorNoite.toLocaleString('pt-BR')}/noite`,
        }))
      );
  }

  setFiltro(filtro: string): void {
    this.filtroAtivo = filtro;
  }

  getSlides(hotel: Hotel): PoSlideItem[] {
    return hotel.fotos.map(foto => ({ image: foto }));
  }

  abrirDetalhes(hotel: Hotel): void {
    this.hotelSelecionado = hotel;
    this.modalHotel.open();
  }

  abrirReserva(hotel: Hotel): void {
    this.hotelSelecionado = hotel;
    this.reservaForm = {
      nomeHospede: '',
      email: '',
      telefone: '',
      checkIn: '',
      checkOut: '',
      adultos: 1,
      criancas: 0,
      tipoQuarto: 'standard',
      observacoes: '',
    };
    this.stepperAtivo = 1;
    this.modalHotel.close();
    setTimeout(() => this.modalReserva.open(), 200);
  }

  confirmarReserva(): void {
    if (!this.reservaForm.nomeHospede || !this.reservaForm.email || !this.reservaForm.checkIn || !this.reservaForm.checkOut) {
      this.poNotification.warning('Preencha todos os campos obrigatórios.');
      return;
    }
    this.poNotification.success(
      `Reserva no ${this.hotelSelecionado?.nome} confirmada com sucesso! Você receberá um e-mail em ${this.reservaForm.email}.`
    );
    this.modalReserva.close();
  }

  getTotalNoites(): number {
    if (!this.reservaForm.checkIn || !this.reservaForm.checkOut) return 0;
    const diff = new Date(this.reservaForm.checkOut).getTime() - new Date(this.reservaForm.checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  getTotalEstimado(): number {
    if (!this.hotelSelecionado) return 0;
    return this.getTotalNoites() * this.hotelSelecionado.precoPorNoite;
  }

  getEstrelas(qtd: number): string[] {
    return Array(qtd).fill('an an-star');
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
