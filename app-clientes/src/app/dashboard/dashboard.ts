import { Component } from '@angular/core';
import {
  PoChartModule,
  PoChartSerie,
  PoChartType,
  PoContainerModule,
  PoDividerModule,
  PoPageModule,
  PoTagType,
  PoTreeViewItem,
  PoTreeViewModule,
  PoWidgetModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-dashboard',
  imports: [PoPageModule, PoChartModule, PoContainerModule, PoDividerModule, PoTreeViewModule, PoWidgetModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly chartTypeColumn = PoChartType.Column;
  readonly chartTypeLine = PoChartType.Line;
  readonly chartTypeDonut = PoChartType.Donut;
  readonly chartTypeBar = PoChartType.Bar;

  // KPIs
  kpis = [
    {
      label: 'Total de Clientes',
      valor: '901',
      icone: 'an an-users',
      tendencia: '↑ 5,2%',
      tendenciaNegativa: false,
      detalhe: 'vs. mês anterior',
      corClasse: 'kpi-azul',
    },
    {
      label: 'Clientes Ativos',
      valor: '620',
      icone: 'an an-check-circle',
      tendencia: '↑ 3,1%',
      tendenciaNegativa: false,
      detalhe: 'vs. mês anterior',
      corClasse: 'kpi-verde',
    },
    {
      label: 'Taxa de Atividade',
      valor: '68,8%',
      icone: 'an an-activity',
      tendencia: '↑ 2,1 p.p.',
      tendenciaNegativa: false,
      detalhe: 'vs. mês anterior',
      corClasse: 'kpi-indigo',
    },
    {
      label: 'Receita do Mês',
      valor: 'R$ 97k',
      icone: 'an an-trending-up',
      tendencia: '↑ 3,0%',
      tendenciaNegativa: false,
      detalhe: 'acima da meta',
      corClasse: 'kpi-laranja',
    },
  ];

  // Vendas mensais por região (Column)
  categoriesVendas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

  seriesVendas: Array<PoChartSerie> = [
    { label: 'Sul', data: [42000, 38000, 51000, 47000, 63000, 58000], color: 'color-01' },
    { label: 'Sudeste', data: [85000, 79000, 92000, 88000, 104000, 97000], color: 'color-02' },
    { label: 'Norte', data: [21000, 18000, 25000, 22000, 30000, 27000], color: 'color-03' },
  ];

  // Tendência de receita (Line)
  categoriesReceita = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  seriesReceita: Array<PoChartSerie> = [
    { label: 'Receita 2025', data: [120, 135, 148, 160, 175, 182, 190, 205, 215, 230, 242, 260], color: 'color-11' },
    { label: 'Meta 2025', data: [130, 140, 155, 165, 180, 190, 200, 210, 220, 235, 248, 270], color: 'color-07' },
  ];

  // Distribuição de clientes por status (Donut)
  seriesStatus: Array<PoChartSerie> = [
    { label: 'Ativos', data: 620, color: 'color-11' },
    { label: 'Inativos', data: 184, color: 'color-07' },
    { label: 'Pendentes', data: 97, color: 'color-08' },
  ];

  // Produtos mais vendidos (Bar)
  categoriesProdutos = ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'];

  seriesProdutos: Array<PoChartSerie> = [
    { label: 'Unidades vendidas', data: [4200, 3850, 3100, 2700, 2150], color: 'color-02' },
  ];

  // Hierarquia de categorias de produtos
  categoriasTree: Array<PoTreeViewItem> = [
    {
      label: 'Eletrônicos',
      value: 'eletronicos',
      expanded: true,
      subItems: [
        {
          label: 'Smartphones',
          value: 'smartphones',
          subItems: [
            { label: 'Android', value: 'android' },
            { label: 'iOS', value: 'ios' },
          ],
        },
        {
          label: 'Computadores',
          value: 'computadores',
          subItems: [
            { label: 'Notebooks', value: 'notebooks' },
            { label: 'Desktops', value: 'desktops' },
          ],
        },
        { label: 'Acessórios', value: 'acessorios' },
      ],
    },
    {
      label: 'Vestuário',
      value: 'vestuario',
      subItems: [
        { label: 'Masculino', value: 'masculino' },
        { label: 'Feminino', value: 'feminino' },
        { label: 'Infantil', value: 'infantil' },
      ],
    },
    {
      label: 'Alimentos',
      value: 'alimentos',
      subItems: [
        { label: 'Bebidas', value: 'bebidas' },
        { label: 'Laticínios', value: 'laticinios' },
        { label: 'Grãos e Cereais', value: 'graos' },
      ],
    },
    {
      label: 'Casa e Jardim',
      value: 'casa-jardim',
      subItems: [
        { label: 'Móveis', value: 'moveis' },
        { label: 'Ferramentas', value: 'ferramentas' },
      ],
    },
  ];

  onItemSelecionado(item: PoTreeViewItem): void {
    console.log('Item selecionado:', item);
  }

  cards = [
    {
      titulo: 'Novos Clientes',
      valor: '48',
      descricao: 'cadastros neste mês',
      acaoPrimaria: 'Ver clientes',
      tag: 'Alta',
      tagTipo: PoTagType.Success,
      icone: 'an an-user-plus',
    },
    {
      titulo: 'Receita do Mês',
      valor: 'R$ 97k',
      descricao: 'acima da meta em 3%',
      acaoPrimaria: 'Ver relatório',
      tag: 'Meta',
      tagTipo: PoTagType.Info,
      icone: 'an an-trending-up',
    },
    {
      titulo: 'Pedidos Pendentes',
      valor: '23',
      descricao: 'aguardando aprovação',
      acaoPrimaria: 'Revisar',
      tag: 'Atenção',
      tagTipo: PoTagType.Warning,
      icone: 'an an-clock',
    },
    {
      titulo: 'Cancelamentos',
      valor: '7',
      descricao: 'neste mês',
      acaoPrimaria: 'Analisar',
      tag: 'Crítico',
      tagTipo: PoTagType.Danger,
      icone: 'an an-x-circle',
    },
  ];
}
