import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import {
  GraphEdgeInput,
  GraphNodeClickEvent,
  GraphNodeInput,
  GrafoViewerComponent,
} from './grafo-viewer/grafo-viewer.component';

// ── Tipos internos ────────────────────────────────────────────────────────
interface Parsed {
  nodes: GraphNodeInput[];
  edges: GraphEdgeInput[];
}

interface Sample {
  key: string;
  label: string;
  json: string;
}

@Component({
  selector: 'app-grafos',
  imports: [
    CommonModule,
    FormsModule,
    PoButtonModule,
    PoFieldModule,
    PoModalModule,
    PoPageModule,
    GrafoViewerComponent,
  ],
  templateUrl: './grafos.html',
  styleUrl: './grafos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grafos {
  // ── Amostras ────────────────────────────────────────────────────────────
  readonly samples: Sample[] = [
    {
      key: 'fluxo',
      label: 'Fluxo de dados',
      json: `{
  "nodes": [
    { "id": "n1", "label": "Início", "group": "Entrada" },
    { "id": "n2", "label": "Receber pedido", "group": "Processo" },
    { "id": "n3", "label": "Validar pagamento", "group": "Processo" },
    { "id": "n4", "label": "Verificar estoque", "group": "Processo" },
    { "id": "n5", "label": "Processar pedido", "group": "Processo" },
    { "id": "n6", "label": "Enviar confirmação", "group": "Saída" },
    { "id": "n7", "label": "Gerar nota fiscal", "group": "Saída" },
    { "id": "n8", "label": "Fim", "group": "Saída" }
  ],
  "edges": [
    { "from": "n1", "to": "n2" },
    { "from": "n2", "to": "n3" },
    { "from": "n2", "to": "n4" },
    { "from": "n3", "to": "n5", "label": "aprovado" },
    { "from": "n4", "to": "n5" },
    { "from": "n5", "to": "n6" },
    { "from": "n5", "to": "n7" },
    { "from": "n6", "to": "n8" },
    { "from": "n7", "to": "n8" }
  ]
}`,
    },
    {
      key: 'ciclos',
      label: 'Rede com ciclos',
      json: `{
  "nodes": [
    { "id": "a", "label": "Serviço A" },
    { "id": "b", "label": "Serviço B" },
    { "id": "c", "label": "Serviço C" },
    { "id": "d", "label": "Serviço D" },
    { "id": "e", "label": "Fila" },
    { "id": "f", "label": "Cache" }
  ],
  "edges": [
    { "from": "a", "to": "b" },
    { "from": "b", "to": "c" },
    { "from": "c", "to": "a", "label": "retry" },
    { "from": "b", "to": "e" },
    { "from": "e", "to": "f" },
    { "from": "f", "to": "b", "label": "recarga" },
    { "from": "d", "to": "e" },
    { "from": "d", "to": "c" }
  ]
}`,
    },
    {
      key: 'projetos',
      label: 'Hierarquia de projetos',
      json: `{
  "nodes": [
    { "id": "p1", "label": "Projeto Alpha", "group": "Direção" },
    { "id": "p2", "label": "Backend", "group": "Tecnologia" },
    { "id": "p3", "label": "Frontend", "group": "Tecnologia" },
    { "id": "p4", "label": "Dados", "group": "Tecnologia" },
    { "id": "p5", "label": "API", "group": "Backend" },
    { "id": "p6", "label": "Auth", "group": "Backend" },
    { "id": "p7", "label": "UI", "group": "Frontend" },
    { "id": "p8", "label": "Relatórios", "group": "Dados" },
    { "id": "p9", "label": "Testes", "group": "QA" },
    { "id": "p10", "label": "Publicação", "group": "Ops" }
  ],
  "edges": [
    { "from": "p1", "to": "p2" },
    { "from": "p1", "to": "p3" },
    { "from": "p1", "to": "p4" },
    { "from": "p2", "to": "p5" },
    { "from": "p2", "to": "p6" },
    { "from": "p3", "to": "p7" },
    { "from": "p4", "to": "p8" },
    { "from": "p5", "to": "p9" },
    { "from": "p7", "to": "p9" },
    { "from": "p8", "to": "p9" },
    { "from": "p9", "to": "p10" }
  ]
}`,
    },
    {
      key: 'rede',
      label: 'Rede densa (sensores)',
      json: `{
  "nodes": [
    { "id": "s1", "label": "Sensor 1" },
    { "id": "s2", "label": "Sensor 2" },
    { "id": "s3", "label": "Sensor 3" },
    { "id": "m1", "label": "Módulo A" },
    { "id": "m2", "label": "Módulo B" },
    { "id": "m3", "label": "Módulo C" },
    { "id": "out", "label": "Saída" }
  ],
  "edges": [
    { "from": "s1", "to": "m1" },
    { "from": "s1", "to": "m3" },
    { "from": "s2", "to": "m1" },
    { "from": "s2", "to": "m2" },
    { "from": "s3", "to": "m2" },
    { "from": "s3", "to": "m3" },
    { "from": "m1", "to": "out" },
    { "from": "m2", "to": "out" },
    { "from": "m3", "to": "out" }
  ]
}`,
    },
  ];

  readonly sampleOptions = this.samples.map((s) => ({ label: s.label, value: s.key }));

  readonly jsonPlaceholder = '{ "nodes": [...], "edges": [...] }';

  // ── Estado reativo ──────────────────────────────────────────────────────
  parsedNodes = signal<GraphNodeInput[]>([]);
  parsedEdges = signal<GraphEdgeInput[]>([]);
  jsonText = signal('');
  errorMsg = signal('');
  selectedSample = signal(this.samples[0].key);

  @ViewChild('jsonModal') jsonModal!: PoModalComponent;

  primaryAction: PoModalAction = {
    label: 'Aplicar',
    action: () => {
      this.applyJson();
      this.jsonModal.close();
    },
  };

  secondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.jsonModal.close(),
  };

  constructor(private notification: PoNotificationService) {
    this.applySample(this.selectedSample());
  }

  // ── Amostras / JSON ─────────────────────────────────────────────────────

  applySample(key: string): void {
    const s = this.samples.find((x) => x.key === key) ?? this.samples[0];
    this.selectedSample.set(s.key);
    this.jsonText.set(s.json);
    this.applyJson(s.json);
  }

  onJsonChange(text: string): void {
    this.jsonText.set(text);
  }

  applyJson(text?: string): void {
    const parsed = this.parseJson(text ?? this.jsonText());
    if (!parsed) return;
    this.parsedNodes.set(parsed.nodes);
    this.parsedEdges.set(parsed.edges);
  }

  // ── Consumo do output do componente ─────────────────────────────────────

  onNodeClick(event: GraphNodeClickEvent): void {
    this.notification.information(
      `Nó "${event.node.label}" selecionado (camada ${event.layer}).`
    );
  }

  openJsonModal(): void {
    this.jsonModal.open();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      this.jsonText.set(text);
      this.applyJson(text);
    };
    reader.readAsText(file);
    (event.target as HTMLInputElement).value = '';
  }



  // ── Parsing do JSON ─────────────────────────────────────────────────────

  private parseJson(text: string): Parsed | null {
    this.errorMsg.set('');
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      this.errorMsg.set('JSON inválido: verifique a sintaxe.');
      return null;
    }

    const obj = this.asRecord(raw);
    if (!obj) {
      this.errorMsg.set('O JSON deve ser um objeto com "nodes" e "edges".');
      return null;
    }

    const nodes: GraphNodeInput[] = [];
    const seen = new Set<string>();
    for (const item of this.asArray(obj['nodes'])) {
      if (item === null || item === undefined) continue;
      if (typeof item === 'string') {
        if (!seen.has(item)) {
          seen.add(item);
          nodes.push({ id: item, label: item });
        }
        continue;
      }
      const no = this.asRecord(item);
      if (!no) continue;
      const id = this.firstString(no, ['id', 'key']);
      if (id === undefined || seen.has(id)) continue;
      seen.add(id);
      nodes.push({
        id,
        label: this.firstString(no, ['label', 'name', 'text']) ?? id,
        group: this.firstString(no, ['group', 'color', 'type']),
      });
    }

    const edges: GraphEdgeInput[] = [];
    for (const item of this.asArray(obj['edges'])) {
      if (item === null || item === undefined) continue;
      let from: string | undefined;
      let to: string | undefined;
      let label: string | undefined;
      if (Array.isArray(item)) {
        from = this.str(item[0]);
        to = this.str(item[1]);
      } else {
        const eo = this.asRecord(item);
        if (!eo) continue;
        from = this.firstString(eo, ['from', 'source', 'sourceId', 'u']);
        to = this.firstString(eo, ['to', 'target', 'targetId', 'v']);
        label = this.firstString(eo, ['label', 'name', 'text']);
      }
      if (from === undefined || to === undefined) continue;
      edges.push({ from, to, label });
    }

    if (nodes.length === 0 && edges.length === 0) {
      this.errorMsg.set('O JSON não contém nós nem arestas.');
      return null;
    }
    return { nodes, edges };
  }

  private asRecord(v: unknown): Record<string, unknown> | null {
    return v !== null && typeof v === 'object' && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : null;
  }

  private asArray(v: unknown): unknown[] {
    return Array.isArray(v) ? v : [];
  }

  private str(v: unknown): string | undefined {
    return v === undefined || v === null ? undefined : String(v);
  }

  private firstString(obj: Record<string, unknown>, keys: string[]): string | undefined {
    for (const k of keys) {
      const v = this.str(obj[k]);
      if (v !== undefined) return v;
    }
    return undefined;
  }

}
