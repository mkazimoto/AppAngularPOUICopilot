import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
    PoBreadcrumb,
    PoButtonModule,
    PoContainerModule,
    PoModalAction,
    PoModalComponent,
    PoModalModule,
    PoNotificationService,
    PoPageModule,
    PoTagModule,
    PoTagType,
    PoWidgetModule,
} from '@po-ui/ng-components';

export interface Carro {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  categoria: string;
  precoDiaria: number;
  km: string;
  combustivel: string;
  cambio: string;
  lugares: number;
  imagemUrl: string;
  disponivel: boolean;
  destaque: boolean;
  avaliacoes: number;
  descricao: string;
}

@Component({
  selector: 'app-carros',
  imports: [
    CommonModule,
    PoPageModule,
    PoWidgetModule,
    PoButtonModule,
    PoTagModule,
    PoModalModule,
    PoContainerModule,
  ],
  templateUrl: './carros.html',
  styleUrl: './carros.css',
})
export class Carros {
  @ViewChild('modalReserva') modalReserva!: PoModalComponent;
  @ViewChild('modalDetalhe') modalDetalhe!: PoModalComponent;

  carroSelecionado?: Carro;
  filtroCategoria = '';
  termoBusca = '';

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/dashboard' }, { label: 'Aluguel de Carros' }],
  };

  readonly tagTypeSuccess = PoTagType.Success;
  readonly tagTypeDanger = PoTagType.Danger;
  readonly tagTypeInfo = PoTagType.Info;
  readonly tagTypeNeutral = PoTagType.Neutral;
  readonly tagTypeWarning = PoTagType.Warning;

  readonly categorias = ['Todos', 'Econômico', 'Executivo', 'SUV', 'Pickup', 'Esportivo'];

  readonly carros: Carro[] = [
    {
      id: 1,
      modelo: 'Onix 1.0 Turbo',
      marca: 'Chevrolet',
      ano: 2024,
      categoria: 'Econômico',
      precoDiaria: 129.90,
      km: 'Ilimitado',
      combustivel: 'Flex',
      cambio: 'Automático',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/onix2024/600/400',
      disponivel: true,
      destaque: false,
      avaliacoes: 312,
      descricao: 'Carro compacto ideal para o dia a dia urbano, com baixo consumo e excelente custo-benefício.',
    },
    {
      id: 2,
      modelo: 'Polo 200 TSI',
      marca: 'Volkswagen',
      ano: 2024,
      categoria: 'Econômico',
      precoDiaria: 149.90,
      km: 'Ilimitado',
      combustivel: 'Flex',
      cambio: 'Automático',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/polo2024/600/400',
      disponivel: true,
      destaque: true,
      avaliacoes: 487,
      descricao: 'Hatch moderno com motor turbo, design europeu e tecnologia de ponta.',
    },
    {
      id: 3,
      modelo: 'Corolla 2.0 XEi',
      marca: 'Toyota',
      ano: 2024,
      categoria: 'Executivo',
      precoDiaria: 249.90,
      km: 'Ilimitado',
      combustivel: 'Flex',
      cambio: 'CVT',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/corolla2024/600/400',
      disponivel: true,
      destaque: true,
      avaliacoes: 823,
      descricao: 'Sedã premium com acabamento sofisticado, amplamente conhecido por sua confiabilidade.',
    },
    {
      id: 4,
      modelo: 'Civic Touring',
      marca: 'Honda',
      ano: 2024,
      categoria: 'Executivo',
      precoDiaria: 269.90,
      km: 'Ilimitado',
      combustivel: 'Flex',
      cambio: 'CVT',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/civic2024/600/400',
      disponivel: false,
      destaque: false,
      avaliacoes: 641,
      descricao: 'Sedã esportivo com tecnologia Honda Sensing, painel digital e conectividade avançada.',
    },
    {
      id: 5,
      modelo: 'Compass Limited',
      marca: 'Jeep',
      ano: 2024,
      categoria: 'SUV',
      precoDiaria: 329.90,
      km: 'Ilimitado',
      combustivel: 'Flex',
      cambio: 'Automático',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/compass2024/600/400',
      disponivel: true,
      destaque: true,
      avaliacoes: 1024,
      descricao: 'SUV robusto com tração 4x4, design imponente e interior requintado.',
    },
    {
      id: 6,
      modelo: 'Tiguan Allspace',
      marca: 'Volkswagen',
      ano: 2024,
      categoria: 'SUV',
      precoDiaria: 389.90,
      km: 'Ilimitado',
      combustivel: 'Gasolina',
      cambio: 'Automático',
      lugares: 7,
      imagemUrl: 'https://picsum.photos/seed/tiguan2024/600/400',
      disponivel: true,
      destaque: false,
      avaliacoes: 563,
      descricao: 'SUV de 7 lugares com espaço generoso, motor turbo poderoso e segurança máxima.',
    },
    {
      id: 7,
      modelo: 'Hilux CD SRV',
      marca: 'Toyota',
      ano: 2024,
      categoria: 'Pickup',
      precoDiaria: 359.90,
      km: 'Ilimitado',
      combustivel: 'Diesel',
      cambio: 'Automático',
      lugares: 5,
      imagemUrl: 'https://picsum.photos/seed/hilux2024/600/400',
      disponivel: true,
      destaque: false,
      avaliacoes: 748,
      descricao: 'Picape lendária com capacidade de carga excepcional, 4x4 e motor turbodiesel.',
    },
    {
      id: 8,
      modelo: 'Mustang GT 5.0',
      marca: 'Ford',
      ano: 2024,
      categoria: 'Esportivo',
      precoDiaria: 599.90,
      km: '300 km/dia',
      combustivel: 'Gasolina',
      cambio: 'Manual',
      lugares: 4,
      imagemUrl: 'https://picsum.photos/seed/mustang2024/600/400',
      disponivel: true,
      destaque: true,
      avaliacoes: 2091,
      descricao: 'Ícone americano com motor V8 5.0L, 450cv e o rugido inconfundível que encanta entusiastas.',
    },
    {
      id: 9,
      modelo: 'GR Supra 3.0',
      marca: 'Toyota',
      ano: 2024,
      categoria: 'Esportivo',
      precoDiaria: 699.90,
      km: '300 km/dia',
      combustivel: 'Gasolina',
      cambio: 'Automático',
      lugares: 2,
      imagemUrl: 'https://picsum.photos/seed/supra2024/600/400',
      disponivel: false,
      destaque: true,
      avaliacoes: 1387,
      descricao: 'Esportivo puro com motor turbo 340cv, tração traseira e design espetacular.',
    },
  ];

  get carrosFiltrados(): Carro[] {
    return this.carros.filter(c => {
      const matchCategoria = !this.filtroCategoria || c.categoria === this.filtroCategoria;
      const busca = this.termoBusca.toLowerCase();
      const matchBusca =
        !busca ||
        c.modelo.toLowerCase().includes(busca) ||
        c.marca.toLowerCase().includes(busca) ||
        c.categoria.toLowerCase().includes(busca);
      return matchCategoria && matchBusca;
    });
  }

  filtrarCategoria(cat: string) {
    this.filtroCategoria = cat === 'Todos' ? '' : cat;
  }

  buscar(termo: string) {
    this.termoBusca = termo;
  }

  abrirDetalhe(carro: Carro) {
    this.carroSelecionado = carro;
    this.modalDetalhe.open();
  }

  abrirReserva(carro: Carro) {
    this.carroSelecionado = carro;
    this.modalReserva.open();
  }

  confirmarReserva() {
    this.modalReserva.close();
    this.notificationService.success(`Reserva do ${this.carroSelecionado?.marca} ${this.carroSelecionado?.modelo} confirmada!`);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/seed/car-default/600/400';
  }

  readonly acaoConfirmarReserva: PoModalAction = {
    label: 'Confirmar Reserva',
    action: () => this.confirmarReserva(),
  };

  readonly acaoCancelarReserva: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalReserva.close(),
    danger: true,
  };

  readonly acaoFecharDetalhe: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalDetalhe.close(),
  };

  readonly acaoReservarDetalhe: PoModalAction = {
    label: 'Reservar',
    action: () => {
      this.modalDetalhe.close();
      if (this.carroSelecionado) this.abrirReserva(this.carroSelecionado);
    },
  };

  constructor(private notificationService: PoNotificationService) {}
}
