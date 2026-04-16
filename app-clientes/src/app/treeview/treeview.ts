import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi, PoNotificationService, PoPageAction, PoPageFilter, PoPageModule, PoPageSlideComponent, PoPageSlideModule, PoSwitchLabelPosition, PoTagModule, PoTooltipModule } from '@po-ui/ng-components';
import { Observable, of } from 'rxjs';

export type TipoRecurso = 'Insumo' | 'Composição' | 'Valor cotado';

export interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  visible: boolean;
  fixed?: boolean;
}

export interface TreeNode {
  id: string;
  label: string;
  tipoRecurso?: TipoRecurso;
  quantity: number;
  unit: string;
  price: number;
  value: number;
  parentId: string | null;
  expanded: boolean;
  recurso?: string;
  recursoId?: string;
  insumoId?: string;
  composicaoId?: string;
}

export interface FlatNode extends TreeNode {
  level: number;
  hasChildren: boolean;
}

const SENTINEL_ID = '__new__';

const INSUMOS = [
  { id: 'INS001', nome: 'Cimento CP-II 32', unidade: 'KG', preco: 0.85   },
  { id: 'INS002', nome: 'Areia média lavada', unidade: 'M3', preco: 85.00 },
  { id: 'INS003', nome: 'Brita 1', unidade: 'M3', preco: 120.00           },
  { id: 'INS004', nome: 'Aço CA-50 10mm', unidade: 'KG', preco: 8.50     },
  { id: 'INS005', nome: 'Tijolo cerâmico 9 furos', unidade: 'UN', preco: 1.20 },
  { id: 'INS006', nome: 'Cal hidratada CH-III', unidade: 'KG', preco: 0.65 },
  { id: 'INS007', nome: 'Cerâmica piso 60x60', unidade: 'M2', preco: 45.00 },
  { id: 'INS008', nome: 'Tinta acrílica premium', unidade: 'L', preco: 18.00 },
  { id: 'INS009', nome: 'Tubo PVC 100mm', unidade: 'M', preco: 12.50     },
  { id: 'INS010', nome: 'Fio elétrico 2,5mm²', unidade: 'M', preco: 3.80 },
];

class InsumoFilterService implements PoLookupFilter {
  getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    const f = (params.filter ?? '').toUpperCase();
    const items = f
      ? INSUMOS.filter(i => i.nome.toUpperCase().includes(f) || i.id.toUpperCase().includes(f))
      : INSUMOS;
    return of({ items, hasNext: false });
  }
  getObjectByValue(value: string): Observable<any> {
    return of(INSUMOS.find(i => i.id === String(value)) ?? null);
  }
}

const COMPOSICOES = [
  { id: 'COMP001', nome: 'Concreto fck 25 MPa',            unidade: 'M3', preco: 450.00 },
  { id: 'COMP002', nome: 'Argamassa de assentamento',       unidade: 'M3', preco: 220.00 },
  { id: 'COMP003', nome: 'Alvenaria tijolo 9 furos',        unidade: 'M2', preco: 85.00  },
  { id: 'COMP004', nome: 'Revestimento cerâmico 60x60',     unidade: 'M2', preco: 120.00 },
  { id: 'COMP005', nome: 'Pintura acrílica 2 demãos',       unidade: 'M2', preco: 25.00  },
  { id: 'COMP006', nome: 'Instalação elétrica ponto',       unidade: 'PT', preco: 180.00 },
  { id: 'COMP007', nome: 'Instalação hidráulica ramal',     unidade: 'PT', preco: 350.00 },
  { id: 'COMP008', nome: 'Forma de madeira laje',           unidade: 'M2', preco: 65.00  },
  { id: 'COMP009', nome: 'Estrutura metálica cobertura',    unidade: 'KG', preco: 22.00  },
  { id: 'COMP010', nome: 'Impermeabilização manta asfáltica', unidade: 'M2', preco: 95.00 },
];

class ComposicaoFilterService implements PoLookupFilter {
  getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    const f = (params.filter ?? '').toUpperCase();
    const items = f
      ? COMPOSICOES.filter(c => c.nome.toUpperCase().includes(f) || c.id.toUpperCase().includes(f))
      : COMPOSICOES;
    return of({ items, hasNext: false });
  }
  getObjectByValue(value: string): Observable<any> {
    return of(COMPOSICOES.find(c => c.id === String(value)) ?? null);
  }
}

const UNIT_ITEMS = [
  { value: 'UN', label: 'Unidade (UN)'         },
  { value: 'H',  label: 'Hora (H)'             },
  { value: 'KG', label: 'Quilograma (KG)'      },
  { value: 'M',  label: 'Metro (M)'            },
  { value: 'M2', label: 'Metro quadrado (M2)'  },
  { value: 'M3', label: 'Metro cúbico (M3)'    },
  { value: 'L',  label: 'Litro (L)'            },
  { value: 'PT', label: 'Ponto (PT)'           },
];

class UnitFilterService implements PoLookupFilter {
  getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
    const f = (params.filter ?? '').toUpperCase();
    const items = f
      ? UNIT_ITEMS.filter(u => u.value.toUpperCase().includes(f) || u.label.toUpperCase().includes(f))
      : UNIT_ITEMS;
    return of({ items, hasNext: false });
  }
  getObjectByValue(value: string): Observable<any> {
    return of(UNIT_ITEMS.find(u => u.value === String(value)) ?? null);
  }
}

// ── EAP generation constants ────────────────────────────────
const FASES = [
  'Serviços Preliminares', 'Fundações', 'Estrutura', 'Alvenaria', 'Cobertura',
  'Instalações Hidráulicas', 'Instalações Elétricas', 'Revestimentos', 'Esquadrias e Vidros', 'Pintura e Acabamento',
];

const ENTREGAVEIS = [
  'Projeto Executivo', 'Locação da Obra', 'Terraplanagem', 'Radier', 'Pilares',
  'Vigas', 'Laje', 'Paredes', 'Telhado', 'Contrapiso',
];

const PACOTES = [
  'Escavação', 'Concretagem', 'Armação', 'Formas', 'Chapisco',
  'Emboço', 'Reboco', 'Assentamento', 'Instalação', 'Impermeabilização',
];

const ATIVIDADES = [
  'Escavação', 'Formas', 'Armação', 'Concretagem', 'Desforma',
  'Impermeabilização', 'Aterro', 'Compactação', 'Inspeção',
];

const UNITS = ['UN', 'H', 'KG', 'M', 'M2', 'M3', 'L'];
const VALUES = [100, 250, 500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];

function buildEapNodes(): TreeNode[] {
  const nodes: TreeNode[] = [];
  let seq = 1;

 const rootCode = `${(seq).toString().padStart(3, '0')}`;
 const rootId = String(seq++);
 
  nodes.push({
    id: rootId,
    label: `${rootCode} - Construção Residencial`,
    quantity: 1,
    unit: 'UN',
    price: 0,
    value: 0,
    parentId: null,
    expanded: true,
  });

  // 10 fases × 10 entregáveis × 10 pacotes × 9 atividades = 9.000 + 1.000 + 100 + 10 + 1 = 10.111
  for (let f = 0; f < FASES.length; f++) {
    const faseId = String(seq++);
    nodes.push({
      id: faseId,
      label: `${rootCode}.${(f + 1).toString().padStart(2, '0')} - ${FASES[f]}`,
      quantity: 1,
      unit: 'UN',
      price: VALUES[(f * 3) % VALUES.length],
      value: 0,
      parentId: rootId,
      expanded: false,
    });

    for (let e = 0; e < ENTREGAVEIS.length; e++) {
      const entId = String(seq++);
      nodes.push({
        id: entId,
        label: `${rootCode}.${(f + 1).toString().padStart(2, '0')}.${(e + 1).toString().padStart(2, '0')} - ${ENTREGAVEIS[e]}`,
        quantity: (e % 10) + 1,
        unit: UNITS[(f + e) % UNITS.length],
        price: VALUES[(f + e) % VALUES.length],
        value: 0,
        parentId: faseId,
        expanded: false,
      });

      for (let p = 0; p < PACOTES.length; p++) {
        const pacId = String(seq++);
        nodes.push({
          id: pacId,
          label: `${rootCode}.${(f + 1).toString().padStart(2, '0')}.${(e + 1).toString().padStart(2, '0')}.${(p + 1).toString().padStart(2, '0')} - ${PACOTES[p]}`,
          quantity: ((p % 20) + 1) * 10,
          unit: UNITS[(f + e + p) % UNITS.length],
          price: VALUES[(f + e + p) % VALUES.length],
          value: 0,
          parentId: entId,
          expanded: false,
        });

        for (let a = 1; a <= 9; a++) {
          const insumo = INSUMOS[(f + e + p + a) % INSUMOS.length];
          nodes.push({
            id: String(seq++),
            label: `${rootCode}.${(f + 1).toString().padStart(2, '0')}.${(e + 1).toString().padStart(2, '0')}.${(p + 1).toString().padStart(2, '0')}.${a.toString().padStart(2, '00')} - ${ATIVIDADES[a - 1]}`,
            tipoRecurso: 'Insumo',
            quantity: a,
            unit: insumo.unidade,
            price: insumo.preco,
            value: 0,
            recurso: insumo.nome,
            recursoId: insumo.id,
            insumoId: insumo.id,
            parentId: pacId,
            expanded: false,
          });
        }
      }
    }
  }

  return nodes;
}

@Component({
  selector: 'app-treeview',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollingModule, PoButtonModule, PoFieldModule, PoPageModule, PoPageSlideModule, PoTagModule, PoTooltipModule],
  templateUrl: './treeview.html',
  styleUrl: './treeview.css',
})
export class Treeview implements OnInit, AfterViewInit, OnDestroy {
  readonly SENTINEL = SENTINEL_ID;
  readonly ROW_HEIGHT = 50;

  labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;


  // ── Adaptive viewport height ─────────────────────────────
  viewportHeight = 600;
  @ViewChild('treeviewGrid') treeviewGridRef!: ElementRef<HTMLElement>;
  @ViewChild('treeviewHeader') treeviewHeaderRef!: ElementRef<HTMLElement>;
  private resizeObserver!: ResizeObserver;

  // ── Column manager ─────────────────────────────────────────
  @ViewChild('columnManagerSlide') columnManagerSlide!: PoPageSlideComponent;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  private readonly COLUMNS_STORAGE_KEY = 'treeview_columns';

  private readonly DEFAULT_COLUMNS: ColumnConfig[] = [
    { key: 'nome',        label: 'Nome',           width: 450, visible: true, fixed: true },
    { key: 'tipoRecurso', label: 'Tipo de Recurso', width: 130, visible: true },
    { key: 'recurso',     label: 'Recurso',         width: 200, visible: true },
    { key: 'quantidade',  label: 'Quantidade',      width: 110, visible: true },
    { key: 'unidade',     label: 'Unidade',         width: 130, visible: true },
    { key: 'preco',       label: 'Preço Unitário',  width: 150, visible: true },
    { key: 'valor',       label: 'Valor',           width: 120, visible: true },
    { key: 'acoes',       label: 'Ações',           width: 100, visible: true, fixed: true },
  ];

  columns: ColumnConfig[] = [];

  private loadColumns(): ColumnConfig[] {
    try {
      const saved = localStorage.getItem(this.COLUMNS_STORAGE_KEY);
      if (!saved) return this.DEFAULT_COLUMNS.map(c => ({ ...c }));
      const parsed: Array<{ key: string; visible: boolean; width: number }> = JSON.parse(saved);
      const ordered = parsed
        .map(s => {
          const def = this.DEFAULT_COLUMNS.find(d => d.key === s.key);
          return def ? { ...def, visible: s.visible, width: s.width } : null;
        })
        .filter((c): c is ColumnConfig => c !== null);
      // append any new default columns not yet in storage
      this.DEFAULT_COLUMNS.forEach(def => {
        if (!ordered.find(o => o.key === def.key)) ordered.push({ ...def });
      });
      return ordered;
    } catch {
      return this.DEFAULT_COLUMNS.map(c => ({ ...c }));
    }
  }

  saveColumns(): void {
    const payload = this.columns.map(c => ({ key: c.key, visible: c.visible, width: c.width }));
    localStorage.setItem(this.COLUMNS_STORAGE_KEY, JSON.stringify(payload));
  }

  // ── Resizable columns ──────────────────────────────────────
  private _resizingCol = -1;
  private _resizeStartX = 0;
  private _resizeStartWidth = 0;

  get colTemplate(): string {
    return this.columns.filter(c => c.visible).map(c => c.width + 'px').join(' ');
  }

  isVisible(key: string): boolean {
    return this.columns.find(c => c.key === key)?.visible ?? true;
  }

  colOrder(key: string): number {
    return this.columns.filter(c => c.visible).findIndex(c => c.key === key);
  }

  openColumnManager(): void {
    this.columnManagerSlide.open();
  }

  restoreColumns(): void {
    this.columns = this.DEFAULT_COLUMNS.map(c => ({ ...c }));
    this.saveColumns();
  }

  moveColumn(key: string, direction: 'up' | 'down'): void {
    const movable = this.columns.filter(c => !c.fixed);
    const idx = movable.findIndex(c => c.key === key);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= movable.length) return;
    const colIdx = this.columns.indexOf(movable[idx]);
    const swapIdx = this.columns.indexOf(movable[targetIdx]);
    const cols = [...this.columns];
    [cols[colIdx], cols[swapIdx]] = [cols[swapIdx], cols[colIdx]];
    this.columns = cols;
    this.saveColumns();
  }

  isFirstMovable(key: string): boolean {
    const movable = this.columns.filter(c => !c.fixed);
    return movable.length > 0 && movable[0].key === key;
  }

  isLastMovable(key: string): boolean {
    const movable = this.columns.filter(c => !c.fixed);
    return movable.length > 0 && movable[movable.length - 1].key === key;
  }

  resizeStart(event: MouseEvent, colKey: string): void {
    const idx = this.columns.findIndex(c => c.key === colKey);
    if (idx < 0) return;
    this._resizingCol      = idx;
    this._resizeStartX     = event.clientX;
    this._resizeStartWidth = this.columns[idx].width;
    event.preventDefault();
  }

  @HostListener('input', ['$event'])
  onFilterInput(event: Event): void {
    const target = event.target as HTMLElement;
    // Reage apenas ao input do filtro da página (fora do grid e do gerenciador de colunas)
    if (!target.closest('.treeview-grid') && !target.closest('.column-manager-list')) {
      this.onSearch((target as HTMLInputElement).value);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this._resizingCol < 0) return;
    const delta = event.clientX - this._resizeStartX;
    this.columns[this._resizingCol].width = Math.max(60, this._resizeStartWidth + delta);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this._resizingCol >= 0) {
      this._resizingCol = -1;
      this.saveColumns();
    }
  }
  // ───────────────────────────────────────────────────────────

  nodes: TreeNode[] = buildEapNodes();
  visibleNodes: FlatNode[] = [];
  searchTerm = '';

  selectedId: string | null = null;

  selectNode(node: FlatNode): void {
    if (node.id === SENTINEL_ID) return;
    this.selectedId = node.id === this.selectedId ? null : node.id;
  }

  editingId: string | null = null;
  editingIsLeaf = false;
  editForm = { label: '', tipoRecurso: 'Insumo' as string, quantity: 1, unit: 'UN', price: 0, recurso: '', recursoId: '', insumoId: '', composicaoId: '' };

  pendingAdd: { parentId: string | null } | null = null;
  addForm = { label: '', tipoRecurso: 'Insumo' as string, quantity: 1, unit: 'UN', price: 0, recurso: '', recursoId: '', insumoId: '', composicaoId: '' };

  readonly insumoService = new InsumoFilterService();
  readonly composicaoService = new ComposicaoFilterService();
  readonly unitService = new UnitFilterService();
  readonly unitColumns: PoLookupColumn[] = [
    { property: 'value', label: 'Código',    width: '150px' },
    { property: 'label', label: 'Descricao',  width: '300px' },
  ];
  readonly insumoColumns: PoLookupColumn[] = [
    { property: 'id',      label: 'Código',    width: '150px' },
    { property: 'nome',    label: 'Nome',      width: '55%'   },
    { property: 'unidade', label: 'Un.',       width: '150px'  },
    { property: 'preco',   label: 'Preço',     width: '150px'  },
  ];
  readonly composicaoColumns: PoLookupColumn[] = [
    { property: 'id',      label: 'Código',    width: '150px' },
    { property: 'nome',    label: 'Nome',      width: '55%'   },
    { property: 'unidade', label: 'Un.',       width: '150px'  },
    { property: 'preco',   label: 'Preço',     width: '150px'  },
  ];

  readonly tipoRecursoOptions = [
    { label: 'Valor cotado',     value: 'Valor cotado' },
    { label: 'Insumo local',     value: 'Insumo'       },
    { label: 'Composição local', value: 'Composição'   },
  ];

  tipoRecursoColor(tipo?: TipoRecurso): string {
    if (tipo === 'Composição')   return '#55FF99';
    if (tipo === 'Valor cotado') return '#FF9955';
    return '#5599FF';
  }

  readonly pageFilter: PoPageFilter = {
    placeholder: 'Pesquisar por nome ou recurso...',
    action: (value: string) => this.onSearch(value),
    width: 6,
  };

  readonly pageActions: PoPageAction[] = [
    { label: 'Adicionar Tarefa', action: () => {
        const parentId = this.selectedId
          ? (this.nodes.find(n => n.id === this.selectedId)?.parentId ?? null)
          : null;
        this.startAdd(parentId);
      }, icon: 'an an-plus-circle' },
    { label: 'Expandir Todos', action: () => this.expandAll(),   icon: 'an an-arrows-out'  },
    { label: 'Recolher Todos', action: () => this.collapseAll(), icon: 'an an-arrows-in'   },
  ];

  constructor(private notification: PoNotificationService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.columns = this.loadColumns();
    this.recalculateAll();
    this.refreshVisibleNodes();
  }

  ngAfterViewInit(): void {
    this.calculateViewportHeight();
    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.run(() => this.calculateViewportHeight());
    });
    this.resizeObserver.observe(document.documentElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private calculateViewportHeight(): void {
    const grid = this.treeviewGridRef?.nativeElement;
    const header = this.treeviewHeaderRef?.nativeElement;
    if (!grid || !header) return;
    const gridTop = grid.getBoundingClientRect().top;
    const headerH = header.getBoundingClientRect().height;
    const bottomPadding = 24;
    this.viewportHeight = Math.max(300, window.innerHeight - gridTop - headerH - bottomPadding);
  }

  onSearch(term: string | null): void {
    this.searchTerm = (term ?? '').trim();
    this.refreshVisibleNodes();
  }

  refreshVisibleNodes(): void {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      const hasChildrenSet = new Set<string>();
      for (const node of this.nodes) {
        if (node.parentId !== null) hasChildrenSet.add(node.parentId);
      }
      this.visibleNodes = this.nodes
        .filter(n =>
          n.label.toLowerCase().includes(term) ||
          (n.recurso ?? '').toLowerCase().includes(term)
        )
        .map(n => ({ ...n, level: 0, hasChildren: hasChildrenSet.has(n.id) }));
      return;
    }

    const result: FlatNode[] = [];
    const childrenMap = new Map<string | null, TreeNode[]>();
    const hasChildrenSet = new Set<string>();
    for (const node of this.nodes) {
      const key = node.parentId;
      let list = childrenMap.get(key);
      if (!list) { list = []; childrenMap.set(key, list); }
      list.push(node);
      if (node.parentId !== null) hasChildrenSet.add(node.parentId);
    }
    const traverse = (parentId: string | null, level: number): void => {
      for (const node of (childrenMap.get(parentId) ?? [])) {
        const hasChildren = hasChildrenSet.has(node.id);
        result.push({ ...node, level, hasChildren });
        if (node.expanded && hasChildren) traverse(node.id, level + 1);
        if (this.pendingAdd?.parentId === node.id) result.push(this.makeSentinel(node.id, level + 1));
      }
    };
    traverse(null, 0);
    if (this.pendingAdd?.parentId === null) result.unshift(this.makeSentinel(null, 0));
    this.visibleNodes = result;
  }

  private makeSentinel(parentId: string | null, level: number): FlatNode {
    return { id: SENTINEL_ID, label: '', tipoRecurso: 'Valor cotado', quantity: 1, unit: 'UN', price: 0, value: 0, parentId, expanded: false, level, hasChildren: false };
  }

  trackById(_i: number, n: FlatNode): string { return n.id; }

  toggle(node: FlatNode): void {
    const found = this.nodes.find(n => n.id === node.id);
    if (found) { found.expanded = !found.expanded; this.refreshVisibleNodes(); }
  }

  startAdd(parentId: string | null): void {
    this.cancelEdit();
    this.addForm = { label: '', tipoRecurso: 'Valor cotado' as TipoRecurso, quantity: 1, unit: 'UN', price: 0, recurso: '', recursoId: '', insumoId: '', composicaoId: '' };
    this.pendingAdd = { parentId };
    if (parentId !== null) {
      const parent = this.nodes.find(n => n.id === parentId);
      if (parent) parent.expanded = true;
    }
    this.refreshVisibleNodes();
    this.scrollToSentinel();
  }

  private scrollToSentinel(): void {
    this.ngZone.onStable.pipe().subscribe(() => {
      const idx = this.visibleNodes.findIndex(n => n.id === SENTINEL_ID);
      if (idx < 0 || !this.viewport) return;
      const totalHeight = this.viewport.measureScrollOffset('bottom') + this.viewport.measureScrollOffset('top') + this.viewport.elementRef.nativeElement.clientHeight;
      const rowTop = idx * this.ROW_HEIGHT;
      const viewportHeight = this.viewport.elementRef.nativeElement.clientHeight;
      const centeredOffset = rowTop - (viewportHeight - this.ROW_HEIGHT) / 2;
      this.viewport.scrollToOffset(Math.max(0, centeredOffset), 'smooth');
    }).unsubscribe();
  }

  cancelAdd(): void { this.pendingAdd = null; this.refreshVisibleNodes(); }

  saveAdd(): void {
    if (!this.addForm.label.trim()) { this.notification.warning('O campo Nome e obrigatorio.'); return; }
    const addParentId = this.pendingAdd!.parentId;
    const parentWasLeaf = addParentId !== null && !this.nodes.some(n => n.parentId === addParentId);
    const addTipoRecurso: TipoRecurso = this.addForm.recursoId ? this.addForm.tipoRecurso as TipoRecurso : 'Valor cotado';
    this.nodes = [...this.nodes, {
      id: Date.now().toString(), label: this.addForm.label,
      tipoRecurso: addTipoRecurso,
      quantity: this.addForm.quantity, unit: this.addForm.unit,
      price: this.addForm.price, value: this.addForm.quantity * this.addForm.price,
      recurso: this.addForm.recurso, recursoId: this.addForm.recursoId,
      insumoId: this.addForm.insumoId || undefined,
      composicaoId: this.addForm.composicaoId || undefined,
      parentId: addParentId, expanded: false,
    }];
    if (parentWasLeaf) {
      const parentIdx = this.nodes.findIndex(n => n.id === addParentId);
      if (parentIdx > -1) {
        this.nodes[parentIdx] = {
          ...this.nodes[parentIdx],
          quantity: 1, unit: 'UN', price: 0,
          recurso: undefined, recursoId: undefined, insumoId: undefined, composicaoId: undefined,
          tipoRecurso: undefined,
        };
      }
    }
    this.recalculateAncestors(addParentId);
    this.pendingAdd = null;
    this.refreshVisibleNodes();
    this.notification.success('Registro adicionado com sucesso.');
  }

  startEdit(node: FlatNode): void {
    this.cancelAdd();
    this.editingId = node.id;
    this.selectedId = node.id;
    this.editingIsLeaf = !node.hasChildren;
    this.editForm = { label: node.label, tipoRecurso: (node.tipoRecurso ?? (node.recurso ? 'Insumo' : 'Valor cotado')) as string, quantity: node.quantity, unit: node.unit, price: node.price, recurso: node.recurso ?? '', recursoId: node.recursoId ?? '', insumoId: node.insumoId ?? '', composicaoId: node.composicaoId ?? '' };
    this.refreshVisibleNodes();
  }

  cancelEdit(): void { this.editingId = null; this.refreshVisibleNodes(); }

  saveEdit(): void {
    if (!this.editForm.label.trim()) { this.notification.warning('O campo Nome e obrigatorio.'); return; }
    const idx = this.nodes.findIndex(n => n.id === this.editingId);
    if (idx > -1) {
      const editTipoRecurso: TipoRecurso = this.editForm.recursoId ? this.editForm.tipoRecurso as TipoRecurso : 'Valor cotado';
      const updated = { ...this.nodes[idx], ...this.editForm, tipoRecurso: editTipoRecurso };
      const isLeaf = !this.nodes.some(n => n.parentId === updated.id);
      updated.value = isLeaf
        ? updated.quantity * updated.price
        : this.nodes.filter(n => n.parentId === updated.id).reduce((s, c) => s + c.value, 0);
      this.nodes[idx] = updated;
      this.recalculateAncestors(this.nodes[idx].parentId);
      this.notification.success('Registro atualizado com sucesso.');
    }
    this.editingId = null;
    this.refreshVisibleNodes();
  }

  deleteNode(node: FlatNode): void {
    const ids = new Set([node.id, ...this.getAllDescendantIds(node.id)]);
    this.nodes = this.nodes.filter(n => !ids.has(n.id));
    this.recalculateAncestors(node.parentId);
    this.refreshVisibleNodes();
    this.notification.success('Registro excluido com sucesso.');
  }

  onEditRecursoSelected(item: any): void {
    this.editForm.recurso   = item ? item.nome    : '';
    this.editForm.recursoId = item ? item.id      : '';
    this.editForm.insumoId  = item ? item.id      : '';
    this.editForm.unit      = item ? item.unidade : this.editForm.unit;
    this.editForm.price     = item ? item.preco   : this.editForm.price;
  }

  onEditRecursoChange(value: any): void {
    if (!value) {
      this.editForm.recurso   = '';
      this.editForm.recursoId = '';
      this.editForm.insumoId  = '';
    }
  }

  onEditComposicaoSelected(item: any): void {
    this.editForm.recurso      = item ? item.nome    : '';
    this.editForm.recursoId    = item ? item.id      : '';
    this.editForm.composicaoId = item ? item.id      : '';
    this.editForm.unit         = item ? item.unidade : this.editForm.unit;
    this.editForm.price        = item ? item.preco   : this.editForm.price;
  }

  onEditComposicaoChange(value: any): void {
    if (!value) {
      this.editForm.recurso      = '';
      this.editForm.recursoId    = '';
      this.editForm.composicaoId = '';
    }
  }

  onEditTipoRecursoChange(tipo: string): void {
    this.editForm.tipoRecurso  = tipo;
    this.editForm.recurso      = '';
    this.editForm.recursoId    = '';
    this.editForm.insumoId     = '';
    this.editForm.composicaoId = '';
    this.editForm.unit         = 'UN';
    this.editForm.price        = 0;
  }

  onAddRecursoSelected(item: any): void {
    this.addForm.recurso   = item ? item.nome    : '';
    this.addForm.recursoId = item ? item.id      : '';
    this.addForm.insumoId  = item ? item.id      : '';
    this.addForm.unit      = item ? item.unidade : this.addForm.unit;
    this.addForm.price     = item ? item.preco   : this.addForm.price;
  }

  onAddRecursoChange(value: any): void {
    if (!value) {
      this.addForm.recurso   = '';
      this.addForm.recursoId = '';
      this.addForm.insumoId  = '';
    }
  }

  onAddComposicaoSelected(item: any): void {
    this.addForm.recurso      = item ? item.nome    : '';
    this.addForm.recursoId    = item ? item.id      : '';
    this.addForm.composicaoId = item ? item.id      : '';
    this.addForm.unit         = item ? item.unidade : this.addForm.unit;
    this.addForm.price        = item ? item.preco   : this.addForm.price;
  }

  onAddComposicaoChange(value: any): void {
    if (!value) {
      this.addForm.recurso      = '';
      this.addForm.recursoId    = '';
      this.addForm.composicaoId = '';
    }
  }

  onAddTipoRecursoChange(tipo: string): void {
    this.addForm.tipoRecurso  = tipo;
    this.addForm.recurso      = '';
    this.addForm.recursoId    = '';
    this.addForm.insumoId     = '';
    this.addForm.composicaoId = '';
    this.addForm.unit         = 'UN';
    this.addForm.price        = 0;
  }

  indentPx(level: number): string { return level * 24 + 'px'; }

  get editPreviewValue(): number { return (this.editForm.quantity || 0) * (this.editForm.price || 0); }
  get addPreviewValue(): number  { return (this.addForm.quantity  || 0) * (this.addForm.price  || 0); }
  get editUnitReadonly(): boolean { return !!this.editForm.recursoId; }
  get addUnitReadonly(): boolean  { return !!this.addForm.recursoId; }
  get totalProjeto(): number     { return this.nodes.filter(n => n.parentId === null).reduce((s, n) => s + (n.value || 0), 0); }

  private getAllDescendantIds(parentId: string): string[] {
    const childrenMap = new Map<string, string[]>();
    for (const n of this.nodes) {
      if (n.parentId) {
        const list = childrenMap.get(n.parentId) ?? [];
        list.push(n.id);
        childrenMap.set(n.parentId, list);
      }
    }
    const collect = (id: string): string[] => {
      const ids: string[] = [];
      for (const childId of (childrenMap.get(id) ?? [])) { ids.push(childId, ...collect(childId)); }
      return ids;
    };
    return collect(parentId);
  }

  private recalculateAncestors(startParentId: string | null): void {
    let currentId = startParentId;
    while (currentId !== null) {
      const children = this.nodes.filter(n => n.parentId === currentId);
      const total = children.reduce((sum, c) => sum + (c.value || 0), 0);
      const idx = this.nodes.findIndex(n => n.id === currentId);
      if (idx > -1) {
        this.nodes[idx] = { ...this.nodes[idx], value: total };
      }
      const node = this.nodes.find(n => n.id === currentId);
      currentId = node?.parentId ?? null;
    }
  }

  private recalculateAll(): void {
    const childrenMap = new Map<string | null, string[]>();
    for (const n of this.nodes) {
      const key = n.parentId;
      if (!childrenMap.has(key)) childrenMap.set(key, []);
      childrenMap.get(key)!.push(n.id);
    }
    const compute = (id: string): number => {
      const children = childrenMap.get(id) ?? [];
      const idx = this.nodes.findIndex(n => n.id === id);
      let v: number;
      if (children.length === 0) {
        v = this.nodes[idx].quantity * this.nodes[idx].price;
      } else {
        v = children.reduce((sum, cid) => sum + compute(cid), 0);
      }
      this.nodes[idx] = { ...this.nodes[idx], value: v };
      return v;
    };
    for (const rootId of (childrenMap.get(null) ?? [])) {
      compute(rootId);
    }
  }

  private expandAll(): void { this.nodes = this.nodes.map(n => ({ ...n, expanded: true })); this.refreshVisibleNodes(); }
  private collapseAll(): void { this.nodes = this.nodes.map(n => ({ ...n, expanded: false })); this.refreshVisibleNodes(); }
}