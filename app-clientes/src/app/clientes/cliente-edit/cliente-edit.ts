import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  PoBreadcrumb,
  PoFieldModule,
  PoPageModule,
  PoSelectOption,
  PoNotificationService,
} from '@po-ui/ng-components';

import { ClienteService, Cliente } from '../cliente.service';

@Component({
  selector: 'app-cliente-edit',
  imports: [FormsModule, PoPageModule, PoFieldModule],
  templateUrl: './cliente-edit.html',
  styleUrl: './cliente-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteEdit implements OnInit {
  readonly isNovo = signal(false);

  readonly cliente = signal<Cliente>({
    codigo: 0,
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    status: 'ativo',
  });

  readonly statusOptions: PoSelectOption[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Pendente', value: 'pendente' },
  ];

  readonly titulo = computed(() =>
    this.isNovo() ? 'Novo Cliente' : `Editar: ${this.cliente().nome}`,
  );

  readonly breadcrumb = computed<PoBreadcrumb>(() => ({
    items: [
      { label: 'Clientes', link: '/clientes' },
      { label: this.isNovo() ? 'Novo Cliente' : 'Editar Cliente' },
    ],
  }));

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);
  private readonly poNotification = inject(PoNotificationService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isNovo.set(true);
      return;
    }
    const found = this.clienteService.getById(Number(id));
    if (found) {
      this.cliente.set({ ...found });
    } else {
      this.poNotification.error('Cliente não encontrado.');
      this.router.navigate(['/clientes']);
    }
  }

  salvar(): void {
    if (this.isNovo()) {
      this.clienteService.add(this.cliente());
      this.poNotification.success('Cliente cadastrado com sucesso!');
    } else {
      this.clienteService.update(this.cliente());
      this.poNotification.success('Cliente atualizado com sucesso!');
    }
    this.router.navigate(['/clientes']);
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
