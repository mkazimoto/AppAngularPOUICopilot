import { Component, OnInit } from '@angular/core';
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
})
export class ClienteEdit implements OnInit {
  titulo = 'Editar Cliente';

  cliente: Cliente = {
    codigo: 0,
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    status: 'ativo',
  };

  statusOptions: PoSelectOption[] = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' },
    { label: 'Pendente', value: 'pendente' },
  ];

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Clientes', link: '/clientes' },
      { label: 'Editar Cliente' },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private poNotification: PoNotificationService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.clienteService.getById(id);
    if (found) {
      this.cliente = { ...found };
      this.titulo = `Editar: ${found.nome}`;
    } else {
      this.poNotification.error('Cliente não encontrado.');
      this.router.navigate(['/clientes']);
    }
  }

  salvar(): void {
    this.clienteService.update(this.cliente);
    this.poNotification.success('Cliente atualizado com sucesso!');
    this.router.navigate(['/clientes']);
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
