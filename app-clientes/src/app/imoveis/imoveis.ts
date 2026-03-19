import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  PoTagOrientation,
} from '@po-ui/ng-components';

export interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  preco: number;
  condominio?: number;
  iptu?: number;
  tipo: string;
  tipoNegocio: string;
  tipoNegocioTag: PoTagType;
  quartos: number;
  banheiros: number;
  vagas: number;
  areaTotal: number;
  descricao: string;
  fotos: string[];
  destaque: boolean;
  status: string;
  statusTag: PoTagType;
}

@Component({
  selector: 'app-imoveis',
  imports: [
    CommonModule,
    PoPageModule,
    PoWidgetModule,
    PoSlideModule,
    PoTagModule,
    PoModalModule,
    PoInfoModule,
    PoDividerModule,
    PoButtonModule,
  ],
  templateUrl: './imoveis.html',
  styleUrls: ['./imoveis.css'],
})
export class Imoveis implements OnInit {
  @ViewChild('modalImovel') modalImovel!: PoModalComponent;

  readonly PoTagType = PoTagType;
  imovelSelecionado: Imovel | null = null;
  filtroAtivo = 'todos';
  slidesDestaque: PoSlideItem[] = [];

  readonly imoveis: Imovel[] = [
    {
      id: 1,
      titulo: 'Apartamento Alto Padrão com Vista Mar',
      endereco: 'Av. Atlântica, 1200 - Apto 1501',
      bairro: 'Copacabana',
      cidade: 'Rio de Janeiro - RJ',
      preco: 1850000,
      condominio: 1800,
      iptu: 420,
      tipo: 'Apartamento',
      tipoNegocio: 'Venda',
      tipoNegocioTag: PoTagType.Success,
      quartos: 3,
      banheiros: 2,
      vagas: 1,
      areaTotal: 120,
      descricao:
        'Apartamento de alto padrão com vista privilegiada para o mar. Totalmente reformado, com acabamento em mármore, cozinha gourmet e varanda ampla. Condomínio com piscina, academia e portaria 24h.',
      fotos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      ],
      destaque: true,
      status: 'Disponível',
      statusTag: PoTagType.Success,
    },
    {
      id: 2,
      titulo: 'Casa em Condomínio Fechado com Piscina',
      endereco: 'Rua das Acácias, 45',
      bairro: 'Alphaville',
      cidade: 'Barueri - SP',
      preco: 2400000,
      condominio: 3200,
      iptu: 680,
      tipo: 'Casa',
      tipoNegocio: 'Venda',
      tipoNegocioTag: PoTagType.Success,
      quartos: 4,
      banheiros: 4,
      vagas: 3,
      areaTotal: 320,
      descricao:
        'Casa espaçosa em condomínio fechado de alto padrão. 4 suítes, sala ampla com pé direito duplo, cozinha americana, área gourmet com churrasqueira, piscina aquecida e jardim. Segurança 24h.',
      fotos: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      destaque: true,
      status: 'Disponível',
      statusTag: PoTagType.Success,
    },
    {
      id: 3,
      titulo: 'Studio Moderno no Centro Financeiro',
      endereco: 'Rua XV de Novembro, 320 - Apto 802',
      bairro: 'Centro',
      cidade: 'São Paulo - SP',
      preco: 4500,
      condominio: 650,
      tipo: 'Studio',
      tipoNegocio: 'Aluguel',
      tipoNegocioTag: PoTagType.Info,
      quartos: 1,
      banheiros: 1,
      vagas: 1,
      areaTotal: 38,
      descricao:
        'Studio completamente mobiliado e equipado. Ideal para profissionais que buscam praticidade e localização privilegiada. Próximo a estações de metrô, restaurantes e serviços. Academia e coworking no condomínio.',
      fotos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      destaque: false,
      status: 'Disponível',
      statusTag: PoTagType.Success,
    },
    {
      id: 4,
      titulo: 'Cobertura Duplex com Terraço Privativo',
      endereco: 'Av. Brasil, 900 - Cobertura',
      bairro: 'Jardins',
      cidade: 'São Paulo - SP',
      preco: 4900000,
      condominio: 5500,
      iptu: 1200,
      tipo: 'Cobertura',
      tipoNegocio: 'Venda',
      tipoNegocioTag: PoTagType.Success,
      quartos: 5,
      banheiros: 5,
      vagas: 4,
      areaTotal: 580,
      descricao:
        'Exclusiva cobertura duplex com terraço privativo de 200m² e piscina própria. Projeto assinado por arquiteto renomado, com materiais importados e automação residencial completa. Uma joia rara no mercado imobiliário.',
      fotos: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
      ],
      destaque: true,
      status: 'Oportunidade',
      statusTag: PoTagType.Warning,
    },
    {
      id: 5,
      titulo: 'Apartamento 2 Quartos - Planta Nova',
      endereco: 'Rua Harmonia, 210 - Apto 304',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo - SP',
      preco: 780000,
      condominio: 900,
      iptu: 180,
      tipo: 'Apartamento',
      tipoNegocio: 'Venda',
      tipoNegocioTag: PoTagType.Success,
      quartos: 2,
      banheiros: 2,
      vagas: 1,
      areaTotal: 72,
      descricao:
        'Apartamento novo, nunca habitado, em bairro boêmio e charmoso. Planta inteligente com 2 suítes, varanda gourmet e acabamento de qualidade. Próximo a metrô, bares, restaurantes e comércio.',
      fotos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      ],
      destaque: false,
      status: 'Disponível',
      statusTag: PoTagType.Success,
    },
  ];

  get imoveisFiltrados(): Imovel[] {
    if (this.filtroAtivo === 'todos') return this.imoveis;
    if (this.filtroAtivo === 'venda')
      return this.imoveis.filter(i => i.tipoNegocio === 'Venda');
    if (this.filtroAtivo === 'aluguel')
      return this.imoveis.filter(i => i.tipoNegocio === 'Aluguel');
    if (this.filtroAtivo === 'destaque')
      return this.imoveis.filter(i => i.destaque);
    return this.imoveis;
  }

  get imoveisDestaque(): Imovel[] {
    return this.imoveis.filter(i => i.destaque);
  }

  ngOnInit(): void {
    this.slidesDestaque = this.imoveis
      .filter(i => i.destaque)
      .slice(0, 3)
      .map(i => ({
        image: i.fotos[0],
        alt: i.titulo,
        action: () => this.abrirDetalhes(i),
      }));
  }

  getSlides(imovel: Imovel): string[] {
    return imovel.fotos;
  }

  formatarPreco(preco: number, tipoNegocio: string): string {
    if (tipoNegocio === 'Aluguel') {
      return `R$ ${preco.toLocaleString('pt-BR')}/mês`;
    }
    return `R$ ${preco.toLocaleString('pt-BR')}`;
  }

  abrirDetalhes(imovel: Imovel): void {
    this.imovelSelecionado = imovel;
    this.modalImovel.open();
  }

  fecharModal(): void {
    this.modalImovel.close();
    this.imovelSelecionado = null;
  }

  setFiltro(filtro: string): void {
    this.filtroAtivo = filtro;
  }

  readonly acaoPrimaria: PoModalAction = {
    label: 'Agendar Visita',
    action: () => this.fecharModal(),
  };

  readonly acaoSecundaria: PoModalAction = {
    label: 'Fechar',
    action: () => this.fecharModal(),
  };
}
