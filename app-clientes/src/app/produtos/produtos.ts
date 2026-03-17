import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  destaque: boolean;
  avaliacoes: number;
  estrelas: number;
}

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule,
    PoPageModule,
    PoWidgetModule,
    PoButtonModule,
    PoTagModule,
    PoModalModule,
    PoContainerModule,
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos {
  @ViewChild('modalDetalhe') modalDetalhe!: PoModalComponent;
  @ViewChild('modalCarrinho') modalCarrinho!: PoModalComponent;

  produtoSelecionado?: Produto;
  filtroCategoria = '';
  termoBusca = '';
  carrinho: Array<{ produto: Produto; quantidade: number }> = [];

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/dashboard' }, { label: 'Produtos' }],
  };

  readonly tagTypeSuccess = PoTagType.Success;
  readonly tagTypeDanger = PoTagType.Danger;
  readonly tagTypeInfo = PoTagType.Info;
  readonly tagTypeNeutral = PoTagType.Neutral;
  readonly tagTypeWarning = PoTagType.Warning;

  readonly categorias = ['Todos', 'Eletrônicos', 'Moda', 'Casa & Decoração', 'Esportes', 'Beleza'];

  readonly produtos: Produto[] = [
    {
      id: 1,
      nome: 'Smartphone Pro Max 256GB',
      descricao: 'O mais avançado smartphone com câmera de 200MP, tela AMOLED 6.7", bateria de 5000mAh e processador octa-core.',
      preco: 3499.99,
      precoOriginal: 4199.99,
      categoria: 'Eletrônicos',
      imagemUrl: 'https://picsum.photos/seed/phone1/400/300',
      disponivel: true,
      destaque: true,
      avaliacoes: 1248,
      estrelas: 5,
    },
    {
      id: 2,
      nome: 'Notebook Ultraslim 14"',
      descricao: 'Notebook leve e potente com processador i7, 16GB RAM, SSD 512GB e tela Full HD IPS.',
      preco: 4999.99,
      precoOriginal: 5999.99,
      categoria: 'Eletrônicos',
      imagemUrl: 'https://picsum.photos/seed/laptop1/400/300',
      disponivel: true,
      destaque: true,
      avaliacoes: 863,
      estrelas: 4,
    },
    {
      id: 3,
      nome: 'Tênis Running Air Pro',
      descricao: 'Tênis de corrida com tecnologia Air, solado de borracha de alta durabilidade e cabedal respirável.',
      preco: 399.99,
      precoOriginal: 549.99,
      categoria: 'Esportes',
      imagemUrl: 'https://picsum.photos/seed/shoes1/400/300',
      disponivel: true,
      destaque: false,
      avaliacoes: 2341,
      estrelas: 5,
    },
    {
      id: 4,
      nome: 'Câmera DSLR 4K',
      descricao: 'Câmera profissional com sensor full-frame 45MP, gravação 4K 60fps, Wi-Fi e Bluetooth integrados.',
      preco: 7299.99,
      precoOriginal: undefined,
      categoria: 'Eletrônicos',
      imagemUrl: 'https://picsum.photos/seed/camera1/400/300',
      disponivel: true,
      destaque: true,
      avaliacoes: 512,
      estrelas: 5,
    },
    {
      id: 5,
      nome: 'Vestido Floral Premium',
      descricao: 'Vestido elegante com estampa floral, tecido 100% algodão, disponível em vários tamanhos.',
      preco: 189.99,
      precoOriginal: 259.99,
      categoria: 'Moda',
      imagemUrl: 'https://picsum.photos/seed/dress1/400/300',
      disponivel: true,
      destaque: false,
      avaliacoes: 445,
      estrelas: 4,
    },
    {
      id: 6,
      nome: 'Sofá Retrátil 3 Lugares',
      descricao: 'Sofá em tecido suede com função retrátil, almofadas removíveis e estrutura em madeira maciça.',
      preco: 2199.99,
      precoOriginal: 2799.99,
      categoria: 'Casa & Decoração',
      imagemUrl: 'https://picsum.photos/seed/sofa1/400/300',
      disponivel: true,
      destaque: false,
      avaliacoes: 328,
      estrelas: 4,
    },
    {
      id: 7,
      nome: 'Kit Skincare Premium',
      descricao: 'Kit completo de cuidados com a pele: sérum vitamina C, hidratante FPS50, máscara facial e tônico.',
      preco: 299.99,
      precoOriginal: 399.99,
      categoria: 'Beleza',
      imagemUrl: 'https://picsum.photos/seed/beauty1/400/300',
      disponivel: true,
      destaque: true,
      avaliacoes: 1876,
      estrelas: 5,
    },
    {
      id: 8,
      nome: 'Bicicleta Mountain Bike 29"',
      descricao: 'Bicicleta com suspensão dianteira, 21 velocidades, freios a disco hidráulico e quadro de alumínio.',
      preco: 1899.99,
      precoOriginal: undefined,
      categoria: 'Esportes',
      imagemUrl: 'https://picsum.photos/seed/bike1/400/300',
      disponivel: false,
      destaque: false,
      avaliacoes: 734,
      estrelas: 4,
    },
    {
      id: 9,
      nome: 'Fone Bluetooth ANC Pro',
      descricao: 'Headphone over-ear com cancelamento ativo de ruído, 30h de bateria e som Hi-Fi premium.',
      preco: 899.99,
      precoOriginal: 1199.99,
      categoria: 'Eletrônicos',
      imagemUrl: 'https://picsum.photos/seed/headphone1/400/300',
      disponivel: true,
      destaque: false,
      avaliacoes: 3102,
      estrelas: 5,
    },
  ];

  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(p => {
      const matchCategoria = !this.filtroCategoria || this.filtroCategoria === 'Todos' || p.categoria === this.filtroCategoria;
      const matchBusca = !this.termoBusca || p.nome.toLowerCase().includes(this.termoBusca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }

  get totalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  get valorTotalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
  }

  get desconto(): number {
    const precoOriginal = this.carrinho.reduce(
      (total, item) => total + (item.produto.precoOriginal ?? item.produto.preco) * item.quantidade,
      0
    );
    return precoOriginal - this.valorTotalCarrinho;
  }

  get porcentagemDesconto(): number | null {
    if (!this.produtoSelecionado?.precoOriginal) return null;
    return Math.round(
      ((this.produtoSelecionado.precoOriginal - this.produtoSelecionado.preco) /
        this.produtoSelecionado.precoOriginal) *
        100
    );
  }

  readonly acaoPrimaria = { label: 'Ver Carrinho', action: () => this.abrirCarrinho() };

  readonly acaoModalDetalhe: PoModalAction = {
    label: 'Adicionar ao Carrinho',
    action: () => {
      if (this.produtoSelecionado) {
        this.adicionarAoCarrinho(this.produtoSelecionado);
        this.modalDetalhe.close();
      }
    },
  };

  readonly acaoSecundariaModalDetalhe: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalDetalhe.close(),
  };

  readonly acaoPrimariaCarrinho: PoModalAction = {
    label: 'Finalizar Compra',
    action: () => this.finalizarCompra(),
  };

  readonly acaoSecundariaCarrinho: PoModalAction = {
    label: 'Continuar Comprando',
    action: () => this.modalCarrinho.close(),
  };

  constructor(private notificationService: PoNotificationService) {}

  filtrarCategoria(categoria: string): void {
    this.filtroCategoria = categoria === 'Todos' ? '' : categoria;
  }

  buscar(termo: string): void {
    this.termoBusca = termo;
  }

  abrirDetalhe(produto: Produto): void {
    this.produtoSelecionado = produto;
    this.modalDetalhe.open();
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (!produto.disponivel) return;
    const itemExistente = this.carrinho.find(i => i.produto.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.carrinho.push({ produto, quantidade: 1 });
    }
    this.notificationService.success(`"${produto.nome}" adicionado ao carrinho!`);
  }

  removerDoCarrinho(produtoId: number): void {
    this.carrinho = this.carrinho.filter(i => i.produto.id !== produtoId);
  }

  abrirCarrinho(): void {
    this.modalCarrinho.open();
  }

  finalizarCompra(): void {
    this.notificationService.success('Pedido realizado com sucesso! Obrigado pela compra.');
    this.carrinho = [];
    this.modalCarrinho.close();
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  gerarEstrelas(n: number): number[] {
    return Array(n).fill(0);
  }

  porcentagemDescontoItem(produto: Produto): number {
    if (!produto.precoOriginal) return 0;
    return Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/400/300?grayscale';
  }
}
