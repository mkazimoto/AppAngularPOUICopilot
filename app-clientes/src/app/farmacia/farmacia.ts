import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    PoBreadcrumb,
    PoButtonModule,
    PoChartModule,
    PoChartSerie,
    PoChartType,
    PoContainerModule,
    PoDividerModule,
    PoFieldModule,
    PoInfoModule,
    PoInfoOrientation,
    PoModalAction,
    PoModalComponent,
    PoModalModule,
    PoNotificationService,
    PoPageModule,
    PoSelectOption,
    PoTagModule,
    PoTagType,
    PoWidgetModule,
} from '@po-ui/ng-components';

export interface Medicamento {
  id: number;
  nome: string;
  principioAtivo: string;
  laboratorio: string;
  descricao: string;
  uso: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  receita: boolean;
  generico: boolean;
  disponivel: boolean;
  destaque: boolean;
  desconto?: number;
  quantidade: number;
}

@Component({
  selector: 'app-farmacia',
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoWidgetModule,
    PoButtonModule,
    PoTagModule,
    PoModalModule,
    PoContainerModule,
    PoFieldModule,
    PoDividerModule,
    PoInfoModule,
    PoChartModule,
  ],
  templateUrl: './farmacia.html',
  styleUrl: './farmacia.css',
})
export class Farmacia {
  @ViewChild('modalDetalhe') modalDetalhe!: PoModalComponent;
  @ViewChild('modalCarrinho') modalCarrinho!: PoModalComponent;

  medicamentoSelecionado?: Medicamento;
  termoBusca = '';
  filtroCategoria = '';
  carrinho: Array<{ medicamento: Medicamento; quantidade: number }> = [];

  readonly tagTypeSuccess = PoTagType.Success;
  readonly tagTypeDanger = PoTagType.Danger;
  readonly tagTypeInfo = PoTagType.Info;
  readonly tagTypeWarning = PoTagType.Warning;
  readonly tagTypeNeutral = PoTagType.Neutral;

  readonly chartTypeDonut = PoChartType.Donut;
  readonly chartTypeColumn = PoChartType.Column;
  readonly infoOrientationVertical = PoInfoOrientation.Vertical;

  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/dashboard' }, { label: 'Farmácia Online' }],
  };

  readonly categorias: Array<PoSelectOption> = [
    { label: 'Todas as Categorias', value: '' },
    { label: 'Analgésicos', value: 'Analgésicos' },
    { label: 'Antibióticos', value: 'Antibióticos' },
    { label: 'Anti-inflamatórios', value: 'Anti-inflamatórios' },
    { label: 'Vitaminas e Suplementos', value: 'Vitaminas' },
    { label: 'Dermocosméticos', value: 'Dermocosméticos' },
    { label: 'Saúde Cardiovascular', value: 'Cardiovascular' },
    { label: 'Saúde Mental', value: 'Saúde Mental' },
  ];

  readonly medicamentos: Medicamento[] = [
    {
      id: 1,
      nome: 'Dipirona 500mg',
      principioAtivo: 'Metamizol sódico',
      laboratorio: 'EMS',
      descricao: 'Analgésico e antipirético indicado para dores em geral e febre. Ação rápida em até 30 minutos.',
      uso: 'Adultos: 1 comprimido a cada 6 horas. Não ultrapassar 4 comprimidos por dia.',
      preco: 8.9,
      precoOriginal: 12.5,
      categoria: 'Analgésicos',
      receita: false,
      generico: true,
      disponivel: true,
      destaque: true,
      desconto: 29,
      quantidade: 0,
    },
    {
      id: 2,
      nome: 'Amoxicilina 500mg',
      principioAtivo: 'Amoxicilina tri-hidratada',
      laboratorio: 'Medley',
      descricao: 'Antibiótico de amplo espectro para tratamento de infecções bacterianas. Uso sob prescrição médica.',
      uso: 'Conforme prescrição médica. Geralmente 1 cápsula a cada 8 horas por 7 a 10 dias.',
      preco: 22.9,
      categoria: 'Antibióticos',
      receita: true,
      generico: true,
      disponivel: true,
      destaque: false,
      quantidade: 0,
    },
    {
      id: 3,
      nome: 'Ibuprofeno 600mg',
      principioAtivo: 'Ibuprofeno',
      laboratorio: 'Bayer',
      descricao: 'Anti-inflamatório não esteróide (AINE) indicado para dores, inflamações e febre.',
      uso: 'Adultos: 1 comprimido a cada 8 horas. Tomar com alimentos.',
      preco: 18.5,
      precoOriginal: 24.0,
      categoria: 'Anti-inflamatórios',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: true,
      desconto: 23,
      quantidade: 0,
    },
    {
      id: 4,
      nome: 'Vitamina D3 2000 UI',
      principioAtivo: 'Colecalciferol',
      laboratorio: 'Cimed',
      descricao: 'Suplemento de Vitamina D3 para manutenção de ossos, dentes e sistema imunológico saudáveis.',
      uso: '1 cápsula ao dia com refeição ou conforme orientação médica.',
      preco: 34.9,
      precoOriginal: 42.0,
      categoria: 'Vitaminas',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: true,
      desconto: 17,
      quantidade: 0,
    },
    {
      id: 5,
      nome: 'Protetor Solar FPS 60',
      principioAtivo: 'Filtro UV Benzofenona',
      laboratorio: 'Eucerin',
      descricao: 'Protetor solar facial FPS 60 com ação antioxidante. Textura leve, não oleosa e resistente à água.',
      uso: 'Aplicar uniformemente 30 minutos antes da exposição solar. Reaplicar a cada 2 horas.',
      preco: 89.9,
      precoOriginal: 110.0,
      categoria: 'Dermocosméticos',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: false,
      desconto: 18,
      quantidade: 0,
    },
    {
      id: 6,
      nome: 'Losartana 50mg',
      principioAtivo: 'Losartana potássica',
      laboratorio: 'Eurofarma',
      descricao: 'Anti-hipertensivo antagonista dos receptores da angiotensina II. Controle da pressão arterial.',
      uso: 'Conforme prescrição médica. Dose inicial usual: 50mg uma vez ao dia.',
      preco: 14.8,
      categoria: 'Cardiovascular',
      receita: true,
      generico: true,
      disponivel: true,
      destaque: false,
      quantidade: 0,
    },
    {
      id: 7,
      nome: 'Sertralina 50mg',
      principioAtivo: 'Cloridrato de sertralina',
      laboratorio: 'Pfizer',
      descricao: 'Antidepressivo inibidor seletivo da recaptação de serotonina (ISRS). Tratamento de depressão e ansiedade.',
      uso: 'Conforme prescrição médica. Dose usual: 50mg uma vez ao dia.',
      preco: 42.0,
      categoria: 'Saúde Mental',
      receita: true,
      generico: false,
      disponivel: true,
      destaque: false,
      quantidade: 0,
    },
    {
      id: 8,
      nome: 'Ômega 3 1000mg',
      principioAtivo: 'Ácidos graxos EPA e DHA',
      laboratorio: 'Vitafor',
      descricao: 'Suplemento de ácidos graxos essenciais para saúde cardiovascular, cerebral e redução de triglicerídeos.',
      uso: '2 cápsulas ao dia após refeições.',
      preco: 58.9,
      precoOriginal: 75.0,
      categoria: 'Vitaminas',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: true,
      desconto: 21,
      quantidade: 0,
    },
    {
      id: 9,
      nome: 'Paracetamol 750mg',
      principioAtivo: 'Paracetamol',
      laboratorio: 'Neo Química',
      descricao: 'Analgésico e antipirético de uso geral. Indicado para dores leves a moderadas e febre.',
      uso: 'Adultos: 1 comprimido a cada 6 horas. Não exceder 4 comprimidos por dia.',
      preco: 6.5,
      categoria: 'Analgésicos',
      receita: false,
      generico: true,
      disponivel: false,
      destaque: false,
      quantidade: 0,
    },
    {
      id: 10,
      nome: 'Hidratante Corporal Intensive',
      principioAtivo: 'Ureia 10% + Pantenol',
      laboratorio: 'Nívea',
      descricao: 'Creme hidratante intensivo com ureia 10% e pantenol. Indicado para pele muito seca e ressecada.',
      uso: 'Aplicar sobre a pele limpa e seca. Massagear até absorção completa.',
      preco: 29.9,
      precoOriginal: 38.0,
      categoria: 'Dermocosméticos',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: false,
      desconto: 21,
      quantidade: 0,
    },
    {
      id: 11,
      nome: 'Complexo B',
      principioAtivo: 'Vitaminas B1, B2, B3, B5, B6, B9, B12',
      laboratorio: 'Cimed',
      descricao: 'Complexo de vitaminas do grupo B para energia, sistema nervoso e metabolismo celular.',
      uso: '1 comprimido ao dia com refeição.',
      preco: 19.9,
      precoOriginal: 28.0,
      categoria: 'Vitaminas',
      receita: false,
      generico: false,
      disponivel: true,
      destaque: false,
      desconto: 29,
      quantidade: 0,
    },
    {
      id: 12,
      nome: 'Azitromicina 500mg',
      principioAtivo: 'Azitromicina di-hidratada',
      laboratorio: 'EMS',
      descricao: 'Antibiótico macrolídeo de amplo espectro. Tratamento de infecções do trato respiratório e de pele.',
      uso: 'Conforme prescrição médica. Geralmente 500mg uma vez ao dia por 3 a 5 dias.',
      preco: 28.5,
      categoria: 'Antibióticos',
      receita: true,
      generico: true,
      disponivel: true,
      destaque: false,
      quantidade: 0,
    },
  ];

  // Chart - categorias (Donut)
  seriesCategorias: Array<PoChartSerie> = [
    { label: 'Analgésicos', data: 28, color: 'color-01' },
    { label: 'Vitaminas', data: 22, color: 'color-11' },
    { label: 'Dermocosméticos', data: 18, color: 'color-08' },
    { label: 'Antibióticos', data: 14, color: 'color-07' },
    { label: 'Cardiovascular', data: 10, color: 'color-02' },
    { label: 'Outros', data: 8, color: 'color-06' },
  ];

  // Chart - vendas mensais (Column)
  categoriesVendas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  seriesVendas: Array<PoChartSerie> = [
    { label: 'Genéricos', data: [320, 410, 390, 480, 450, 520], color: 'color-01' },
    { label: 'Referência', data: [180, 210, 230, 260, 240, 290], color: 'color-07' },
  ];

  get medicamentosFiltrados(): Medicamento[] {
    return this.medicamentos.filter((m) => {
      const matchCategoria = !this.filtroCategoria || m.categoria === this.filtroCategoria;
      const termo = this.termoBusca.toLowerCase();
      const matchBusca =
        !termo ||
        m.nome.toLowerCase().includes(termo) ||
        m.principioAtivo.toLowerCase().includes(termo) ||
        m.laboratorio.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }

  get totalCarrinho(): number {
    return this.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  }

  get totalValor(): number {
    return this.carrinho.reduce((acc, item) => acc + item.medicamento.preco * item.quantidade, 0);
  }

  get medicamentosDestaque(): Medicamento[] {
    return this.medicamentos.filter((m) => m.destaque && m.disponivel);
  }

  abrirDetalhe(med: Medicamento): void {
    this.medicamentoSelecionado = med;
    this.modalDetalhe.open();
  }

  adicionarAoCarrinho(med: Medicamento): void {
    if (!med.disponivel) return;
    const item = this.carrinho.find((c) => c.medicamento.id === med.id);
    if (item) {
      item.quantidade++;
    } else {
      this.carrinho.push({ medicamento: { ...med }, quantidade: 1 });
    }
    this.notification.success(`${med.nome} adicionado ao carrinho!`);
  }

  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
  }

  alterarQuantidade(index: number, delta: number): void {
    const item = this.carrinho[index];
    item.quantidade += delta;
    if (item.quantidade <= 0) this.carrinho.splice(index, 1);
  }

  abrirCarrinho(): void {
    this.modalCarrinho.open();
  }

  finalizarCompra(): void {
    this.notification.success(`Pedido finalizado! Total: ${this.formatarMoeda(this.totalValor)}`);
    this.carrinho = [];
    this.modalCarrinho.close();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  readonly acaoFecharDetalhe: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalDetalhe.close(),
  };

  readonly acaoAdicionarDetalhe: PoModalAction = {
    label: 'Adicionar ao Carrinho',
    action: () => {
      if (this.medicamentoSelecionado) {
        this.adicionarAoCarrinho(this.medicamentoSelecionado);
        this.modalDetalhe.close();
      }
    },
  };

  readonly acaoFecharCarrinho: PoModalAction = {
    label: 'Continuar Comprando',
    action: () => this.modalCarrinho.close(),
  };

  readonly acaoFinalizarCarrinho: PoModalAction = {
    label: 'Finalizar Compra',
    action: () => this.finalizarCompra(),
  };

  constructor(private notification: PoNotificationService) {}
}
