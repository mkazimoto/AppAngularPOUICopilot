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
  isNovo = false;

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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isNovo = true;
      this.titulo = 'Novo Cliente';
      this.breadcrumb = {
        items: [
          { label: 'Clientes', link: '/clientes' },
          { label: 'Novo Cliente' },
        ],
      };
      return;
    }
    const found = this.clienteService.getById(Number(id));
    if (found) {
      this.cliente = { ...found };
      this.titulo = `Editar: ${found.nome}`;
    } else {
      this.poNotification.error('Cliente não encontrado.');
      this.router.navigate(['/clientes']);
    }
  }

  salvar(): void {
    if (this.isNovo) {
      const { codigo, ...dados } = this.cliente;
      this.clienteService.add(dados);
      this.poNotification.success('Cliente cadastrado com sucesso!');
    } else {
      this.clienteService.update(this.cliente);
      this.poNotification.success('Cliente atualizado com sucesso!');
    }
    this.router.navigate(['/clientes']);
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
