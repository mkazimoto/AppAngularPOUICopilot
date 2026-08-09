import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PoBreadcrumb, PoPageModule } from '@po-ui/ng-components';

interface Kpi {
  rotulo: string;
  valor: string;
  delta: number;
  tendencia: 'up' | 'down';
  icone: string;
  cor: string;
}

interface PontoSerie {
  rotulo: string;
  valor: number;
}

interface SegmentoDonut {
  rotulo: string;
  valor: number;
  cor: string;
}

interface Barra {
  rotulo: string;
  valor: number;
  cor: string;
}

interface Pedido {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  status: 'concluido' | 'pendente' | 'cancelado';
}

const CHART_W = 800;
const CHART_H = 260;
const PAD = { top: 20, right: 20, bottom: 40, left: 60 };
const DONUT_R = 80;
const DONUT_STROKE = 30;

@Component({
  selector: 'app-dashboard',
  imports: [PoPageModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Painel de Controle' }],
  };

  readonly dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  readonly periodos = ['7d', '30d', '90d'] as const;
  readonly periodo = signal<'7d' | '30d' | '90d'>('30d');

  readonly kpis: Kpi[] = [
    { rotulo: 'Receita total', valor: 'R$ 482.590', delta: 12.5, tendencia: 'up', icone: 'dolar', cor: '#4f46e5' },
    { rotulo: 'Pedidos', valor: '3.214', delta: 8.2, tendencia: 'up', icone: 'carrinho', cor: '#0891b2' },
    { rotulo: 'Novos clientes', valor: '1.027', delta: 4.1, tendencia: 'up', icone: 'usuarios', cor: '#059669' },
    { rotulo: 'Taxa de conversão', valor: '3,4%', delta: 1.3, tendencia: 'down', icone: 'alvo', cor: '#d97706' },
  ];

  private readonly receitasPorPeriodo: Record<'7d' | '30d' | '90d', PontoSerie[]> = {
    '7d': [
      { rotulo: 'Seg', valor: 8200 },
      { rotulo: 'Ter', valor: 10400 },
      { rotulo: 'Qua', valor: 7800 },
      { rotulo: 'Qui', valor: 12900 },
      { rotulo: 'Sex', valor: 15600 },
      { rotulo: 'Sáb', valor: 9800 },
      { rotulo: 'Dom', valor: 6100 },
    ],
    '30d': [
      { rotulo: 'Sem 1', valor: 72000 },
      { rotulo: 'Sem 2', valor: 88500 },
      { rotulo: 'Sem 3', valor: 93400 },
      { rotulo: 'Sem 4', valor: 108900 },
    ],
    '90d': [
      { rotulo: 'Jan', valor: 118000 },
      { rotulo: 'Fev', valor: 104500 },
      { rotulo: 'Mar', valor: 129800 },
      { rotulo: 'Abr', valor: 141200 },
      { rotulo: 'Mai', valor: 135600 },
      { rotulo: 'Jun', valor: 152300 },
      { rotulo: 'Jul', valor: 148900 },
      { rotulo: 'Ago', valor: 162400 },
    ],
  };

  readonly receitas = computed<PontoSerie[]>(() => this.receitasPorPeriodo[this.periodo()]);

  readonly serie = computed(() => this.montarGeometria(this.receitas()));

  readonly categorias: SegmentoDonut[] = [
    { rotulo: 'Eletrônicos', valor: 184000, cor: '#4f46e5' },
    { rotulo: 'Moda', valor: 129000, cor: '#0891b2' },
    { rotulo: 'Casa & Decoração', valor: 96000, cor: '#059669' },
    { rotulo: 'Esportes', valor: 73590, cor: '#d97706' },
  ];

  readonly donut = computed(() => {
    const total = this.categorias.reduce((acc, c) => acc + c.valor, 0);
    const circ = 2 * Math.PI * DONUT_R;
    let acc = 0;
    const segs = this.categorias.map((c) => {
      const frac = c.valor / total;
      const seg = { ...c, frac, dash: frac * circ, offset: -acc * circ };
      acc += frac;
      return seg;
    });
    return { segs, total, circ };
  });

  readonly dadosBarras: Barra[] = [
    { rotulo: 'Eletrônicos', valor: 184000, cor: '#4f46e5' },
    { rotulo: 'Moda', valor: 129000, cor: '#7c3aed' },
    { rotulo: 'Casa', valor: 96000, cor: '#0891b2' },
    { rotulo: 'Esportes', valor: 73600, cor: '#059669' },
    { rotulo: 'Beleza', valor: 58400, cor: '#d97706' },
    { rotulo: 'Outros', valor: 31590, cor: '#64748b' },
  ];

  readonly barras = computed(() => {
    const max = Math.max(...this.dadosBarras.map((b) => b.valor));
    return this.dadosBarras.map((b) => ({ ...b, altura: (b.valor / max) * 100 }));
  });

  readonly pedidos: Pedido[] = [
    { id: '#1042', cliente: 'Ana Paula Silva', produto: 'Smartphone Pro Max', valor: 3499.9, status: 'concluido' },
    { id: '#1041', cliente: 'Bruno Costa', produto: 'Notebook Ultraslim 14"', valor: 4999.99, status: 'pendente' },
    { id: '#1040', cliente: 'Carla Mendes', produto: 'Fone Bluetooth ANC', valor: 899.99, status: 'concluido' },
    { id: '#1039', cliente: 'Diego Rocha', produto: 'Tênis Running Air Pro', valor: 399.99, status: 'cancelado' },
    { id: '#1038', cliente: 'Eliane Ferreira', produto: 'Kit Skincare Premium', valor: 299.99, status: 'concluido' },
    { id: '#1037', cliente: 'Fernando Alves', produto: 'Sofá Retrátil 3 Lugares', valor: 2199.99, status: 'pendente' },
  ];

  private montarGeometria(pontos: PontoSerie[]) {
    const innerW = CHART_W - PAD.left - PAD.right;
    const innerH = CHART_H - PAD.top - PAD.bottom;
    const max = Math.max(...pontos.map((p) => p.valor));
    const stepX = innerW / (pontos.length - 1);
    const pts = pontos.map((p, i) => ({
      ...p,
      x: PAD.left + i * stepX,
      y: PAD.top + innerH - (p.valor / max) * innerH,
    }));
    const linha = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const area = `${linha} L${pts[pts.length - 1].x},${PAD.top + innerH} L${pts[0].x},${PAD.top + innerH} Z`;
    const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y: PAD.top + innerH - f * innerH,
      valor: Math.round(max * f),
    }));
    return { pts, linha, area, ticksY, max };
  }

  readonly CHART_W = CHART_W;
  readonly CHART_H = CHART_H;
  readonly PAD = PAD;
  readonly DONUT_R = DONUT_R;
  readonly DONUT_STROKE = DONUT_STROKE;

  formatarEixo(valor: number): string {
    if (valor >= 1000) return `R$ ${(valor / 1000).toFixed(0)}k`;
    return `R$ ${valor}`;
  }

  formatarBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarDelta(delta: number): string {
    return `${Math.abs(delta).toFixed(1)}%`;
  }

  statusLabel(status: Pedido['status']): string {
    return status === 'concluido' ? 'Concluído' : status === 'pendente' ? 'Pendente' : 'Cancelado';
  }
}
