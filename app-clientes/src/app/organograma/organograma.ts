import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PoPageModule } from '@po-ui/ng-components';
import {
  OrgDepartment,
  OrgNode,
  OrgNodeSalvarEvent,
  OrganogramaViewerComponent,
} from './organograma-viewer/organograma-viewer.component';

@Component({
  selector: 'app-organograma',
  imports: [PoPageModule, OrganogramaViewerComponent],
  templateUrl: './organograma.html',
  styleUrl: './organograma.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Organograma {
  /** Departamentos com cores repassados ao visualizador. */
  readonly departamentos: OrgDepartment[] = [
    { value: 'Diretoria', color: '#6366f1' },
    { value: 'Tecnologia', color: '#3b82f6' },
    { value: 'Comercial', color: '#10b981' },
    { value: 'RH', color: '#f59e0b' },
    { value: 'Financeiro', color: '#ef4444' },
    { value: 'Marketing', color: '#ec4899' },
    { value: 'Operações', color: '#8b5cf6' },
  ];

  /** Nós do organograma (two-way binding com o componente). */
  nodes: OrgNode[] = [
    { id: 'n1', name: 'João Silva', role: 'CEO', department: 'Diretoria', parentId: null, photo: 'https://i.pravatar.cc/80?img=11' },
    { id: 'n2', name: 'Maria Santos', role: 'CTO', department: 'Tecnologia', parentId: 'n1', photo: 'https://i.pravatar.cc/80?img=5' },
    { id: 'n3', name: 'Carlos Oliveira', role: 'CFO', department: 'Financeiro', parentId: 'n1', photo: 'https://i.pravatar.cc/80?img=15' },
    { id: 'n4', name: 'Ana Costa', role: 'Dev Lead', department: 'Tecnologia', parentId: 'n2', photo: 'https://i.pravatar.cc/80?img=47' },
    { id: 'n5', name: 'Pedro Lima', role: 'Dev Sênior', department: 'Tecnologia', parentId: 'n4', photo: 'https://i.pravatar.cc/80?img=53' },
    { id: 'n6', name: 'Lucia Ferreira', role: 'Ger. de RH', department: 'RH', parentId: 'n3', photo: 'https://i.pravatar.cc/80?img=9' },
    { id: 'n7', name: 'Roberto Almeida', role: 'Ger. Comercial', department: 'Comercial', parentId: 'n3', photo: 'https://i.pravatar.cc/80?img=33' },
  ];

  onSalvar(event: OrgNodeSalvarEvent): void {
    console.info('Organograma: salvar', event);
  }

  onExcluir(node: OrgNode): void {
    console.info('Organograma: excluir', node);
  }
}
