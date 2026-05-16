import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoPageSlideComponent,
  PoPageSlideModule,
  PoSwitchLabelPosition,
  PoTableColumn,
  PoTooltipModule,
} from '@po-ui/ng-components';

export interface TreeNodeItem {
  id: string;
  level: number;
  hasChildren: boolean;
}

export const NEW_ID = '__new__';

/** Extensão de PoTableColumn com propriedades específicas do treeview. */
export interface TreeviewColumn extends PoTableColumn {
  /** Identificador da coluna (obrigatório; equivale a PoTableColumn.property). */
  property: string;
  /** Largura em pixels usada pelo grid e pelo resize. */
  widthPx: number;
  /** Impede que a coluna seja ocultada ou reordenada. */
  fixed?: boolean;
  /** Template Angular associado a esta coluna. Preenchido em ngAfterViewInit. */
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-treeview-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    PoButtonModule,
    PoFieldModule,
    PoPageSlideModule,
    PoTooltipModule,
  ],
  templateUrl: './treeview-grid.component.html',
  styleUrl: './treeview-grid.component.css',
})
export class TreeviewGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  readonly NEW_ID = NEW_ID;

  /** Templates de coluna declarados no componente pai. */
  @Input() colTemplates: Record<string, TemplateRef<any>> = {};
  @Input() defaultColumns: TreeviewColumn[] = [];
  @Input() visibleNodes: TreeNodeItem[] = [];
  @Input() editingId: string | null = null;
  @Input() selectedId: string | null = null;
  @Input() rowHeight = 50;

  @Output() nodeSelect = new EventEmitter<TreeNodeItem>();

  readonly labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;

  viewportHeight = 600;
  columns: TreeviewColumn[] = [];

  @ViewChild('treeviewGrid')           treeviewGridRef!:    ElementRef<HTMLElement>;
  @ViewChild('treeviewHeaderOuter')    treeviewHeaderOuterRef!: ElementRef<HTMLElement>;
  @ViewChild('treeviewHeader')         treeviewHeaderRef!:  ElementRef<HTMLElement>;
  @ViewChild('columnManagerSlide')     columnManagerSlide!: PoPageSlideComponent;
  @ViewChild(CdkVirtualScrollViewport) viewport!:           CdkVirtualScrollViewport;

  @Input() columnsStorageKey = 'treeview_columns';

  private resizeObserver!: ResizeObserver;
  private _resizingCol      = -1;
  private _resizeStartX     = 0;
  private _resizeStartWidth = 0;
  private _hScrollHandler: (() => void) | null = null;

  constructor(private ngZone: NgZone) {
    afterNextRender(() => {
      this.ngZone.run(() => this.calculateViewportHeight());
    });
  }

  ngOnInit(): void {
    this.columns = this.loadColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['colTemplates'] && Object.keys(this.colTemplates).length > 0) {
      this.applyTemplates();
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.run(() => this.calculateViewportHeight());
    });
    this.resizeObserver.observe(document.documentElement);

    // Sincroniza rolagem horizontal do viewport com o cabeçalho
    const viewportEl = this.viewport.elementRef.nativeElement;
    this._hScrollHandler = () => {
      this.treeviewHeaderOuterRef.nativeElement.scrollLeft = viewportEl.scrollLeft;
    };
    viewportEl.addEventListener('scroll', this._hScrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this._hScrollHandler) {
      this.viewport?.elementRef.nativeElement.removeEventListener('scroll', this._hScrollHandler);
    }
  }

  // ── Templates ────────────────────────────────────────────────

  private applyTemplates(): void {
    this.columns = this.columns.map(col => ({
      ...col,
      template: this.colTemplates[col.property] ?? col.template,
    }));
  }

  // ── Column persistence ───────────────────────────────────────

  private loadColumns(): TreeviewColumn[] {
    try {
      const saved = localStorage.getItem(this.columnsStorageKey);
      if (!saved) return this.defaultColumns.map(c => ({ ...c }));
      const parsed: Array<{ property: string; visible: boolean; widthPx: number }> = JSON.parse(saved);
      const ordered: TreeviewColumn[] = parsed
        .map(s => {
          const def = this.defaultColumns.find(d => d.property === s.property);
          return def ? ({ ...def, visible: s.visible, widthPx: s.widthPx } as TreeviewColumn) : null;
        })
        .filter((c): c is TreeviewColumn => c !== null);
      this.defaultColumns.forEach(def => {
        if (!ordered.find(o => o.property === def.property)) ordered.push({ ...def });
      });
      return ordered;
    } catch {
      return this.defaultColumns.map(c => ({ ...c }));
    }
  }

  saveColumns(): void {
    const payload = this.columns.map(c => ({ property: c.property, visible: c.visible, widthPx: c.widthPx }));
    localStorage.setItem(this.columnsStorageKey, JSON.stringify(payload));
  }

  // ── Column layout ────────────────────────────────────────────

  get colTemplate(): string {
    return this.columns.filter(c => c.visible !== false).map(c => c.widthPx + 'px').join(' ');
  }

  // ── Column manager ───────────────────────────────────────────

  openColumnManager(): void {
    this.columnManagerSlide.open();
  }

  restoreColumns(): void {
    this.columns = this.defaultColumns.map(c => ({ ...c }));
    this.applyTemplates();
    this.saveColumns();
  }

  moveColumn(property: string, direction: 'up' | 'down'): void {
    const movable = this.columns.filter(c => !c.fixed);
    const idx = movable.findIndex(c => c.property === property);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= movable.length) return;
    const colIdx  = this.columns.indexOf(movable[idx]);
    const swapIdx = this.columns.indexOf(movable[targetIdx]);
    const cols = [...this.columns];
    [cols[colIdx], cols[swapIdx]] = [cols[swapIdx], cols[colIdx]];
    this.columns = cols;
    this.saveColumns();
  }

  isFirstMovable(property: string): boolean {
    const movable = this.columns.filter(c => !c.fixed);
    return movable.length > 0 && movable[0].property === property;
  }

  isLastMovable(property: string): boolean {
    const movable = this.columns.filter(c => !c.fixed);
    return movable.length > 0 && movable[movable.length - 1].property === property;
  }

  // ── Column resize ────────────────────────────────────────────

  resizeStart(event: MouseEvent, property: string): void {
    const idx = this.columns.findIndex(c => c.property === property);
    if (idx < 0) return;
    this._resizingCol      = idx;
    this._resizeStartX     = event.clientX;
    this._resizeStartWidth = this.columns[idx].widthPx;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this._resizingCol < 0) return;
    const delta = event.clientX - this._resizeStartX;
    this.columns[this._resizingCol].widthPx = Math.max(60, this._resizeStartWidth + delta);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this._resizingCol >= 0) {
      this._resizingCol = -1;
      this.saveColumns();
    }
  }

  // ── Public API ───────────────────────────────────────────────

  scrollToNew(): void {
    this.ngZone.onStable.pipe().subscribe(() => {
      const idx = this.visibleNodes.findIndex(n => this.isNewNode(n.id));
      if (idx < 0 || !this.viewport) return;
      const rowTop         = idx * this.rowHeight;
      const viewportH      = this.viewport.elementRef.nativeElement.clientHeight;
      const centeredOffset = rowTop - (viewportH - this.rowHeight) / 2;
      this.viewport.scrollToOffset(Math.max(0, centeredOffset), 'smooth');
    }).unsubscribe();
  }

  trackById(_i: number, n: TreeNodeItem): string { return n.id; }

  isNewNode(id: string): boolean {
    return id === NEW_ID;
  }

  isEditingNode(id: string): boolean {
    return id === this.editingId;
  }

  isSelectedNode(id: string): boolean {
    return id === this.selectedId;
  }

  // ── Private ──────────────────────────────────────────────────

  private calculateViewportHeight(): void {
    const grid   = this.treeviewGridRef?.nativeElement;
    const header = this.treeviewHeaderRef?.nativeElement;
    if (!grid || !header) return;
    const gridTop       = grid.getBoundingClientRect().top;
    const headerH       = header.getBoundingClientRect().height;
    const bottomPadding = 24;
    this.viewportHeight = Math.max(300, window.innerHeight - gridTop - headerH - bottomPadding);
  }
}
