import { Component, ViewChild } from '@angular/core';
import {
    PoButtonModule,
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

interface Carro {
  id: number;
  modelo: string;
  marca: string;
  categoria: string;
  ano: number;
  precoDiaria: number;
  combustivel: string;
  cambio: string;
  passageiros: number;
  disponivel: boolean;
  foto: string;
}

@Component({
  selector: 'app-carros',
  imports: [
    PoPageModule,
    PoWidgetModule,
    PoTagModule,
    PoModalModule,
    PoButtonModule,
    PoInfoModule,
    PoFieldModule,
  ],
  templateUrl: './carros.html',
  styleUrl: './carros.css',
  providers: [PoNotificationService],
})
export class Carros {
  readonly PoTagType = PoTagType;

  @ViewChild('modalAluguel') modalAluguel!: PoModalComponent;

  carroSelecionado: Carro | null = null;
  filtroCategoria = '';

  categoriaOpcoes = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Hatch', label: 'Hatch' },
    { value: 'SUV Compacto', label: 'SUV Compacto' },
    { value: 'SUV Médio', label: 'SUV Médio' },
    { value: 'Picape', label: 'Picape' },
  ];

  carros: Carro[] = [
    {
      id: 1,
      modelo: 'Corolla',
      marca: 'Toyota',
      categoria: 'Sedan',
      ano: 2024,
      precoDiaria: 180,
      combustivel: 'Flex',
      cambio: 'Automático',
      passageiros: 5,
      disponivel: true,
      foto: 'https://picsum.photos/seed/corolla2024/600/300',
    },
    {
      id: 2,
      modelo: 'T-Cross',
      marca: 'Volkswagen',
      categoria: 'SUV Compacto',
      ano: 2024,
      precoDiaria: 220,
      combustivel: 'Flex',
      cambio: 'Automático',
      passageiros: 5,
      disponivel: true,
      foto: 'https://picsum.photos/seed/tcross2024/600/300',
    },
    {
      id: 3,
      modelo: 'Strada Cabine Plus',
      marca: 'Fiat',
      categoria: 'Picape',
      ano: 2023,
      precoDiaria: 200,
      combustivel: 'Flex',
      cambio: 'Manual',
      passageiros: 3,
      disponivel: false,
      foto: 'https://picsum.photos/seed/strada2023/600/300',
    },
    {
      id: 4,
      modelo: 'HR-V EXL',
      marca: 'Honda',
      categoria: 'SUV Médio',
      ano: 2024,
      precoDiaria: 250,
      combustivel: 'Flex',
      cambio: 'Automático',
      passageiros: 5,
      disponivel: true,
      foto: 'https://picsum.photos/seed/hrv2024/600/300',
    },
    {
      id: 5,
      modelo: 'Onix Plus',
      marca: 'Chevrolet',
      categoria: 'Hatch',
      ano: 2023,
      precoDiaria: 140,
      combustivel: 'Flex',
      cambio: 'Automático',
      passageiros: 5,
      disponivel: true,
      foto: 'https://picsum.photos/seed/onix2023/600/300',
    },
    {
      id: 6,
      modelo: 'Hilux SRX',
      marca: 'Toyota',
      categoria: 'Picape',
      ano: 2024,
      precoDiaria: 320,
      combustivel: 'Diesel',
      cambio: 'Automático',
      passageiros: 5,
      disponivel: true,
      foto: 'https://picsum.photos/seed/hilux2024/600/300',
    },
  ];

  get carrosFiltrados(): Carro[] {
    if (!this.filtroCategoria) return this.carros;
    return this.carros.filter(c => c.categoria === this.filtroCategoria);
  }

  alugarAcao: PoModalAction = {
    label: 'Confirmar Aluguel',
    action: () => this.confirmarAluguel(),
  };

  cancelarAcao: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalAluguel.close(),
  };

  constructor(private poNotification: PoNotificationService) {}

  abrirModal(carro: Carro): void {
    this.carroSelecionado = carro;
    this.modalAluguel.open();
  }

  confirmarAluguel(): void {
    if (this.carroSelecionado) {
      this.poNotification.success(
        `${this.carroSelecionado.marca} ${this.carroSelecionado.modelo} reservado com sucesso!`,
      );
    }
    this.modalAluguel.close();
  }
}
