import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoPageModule,
  PoTableColumn,
  PoTableModule,
  PoButtonModule,
  PoTagModule,
} from '@po-ui/ng-components';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  imports: [PoPageModule, PoTableModule, PoButtonModule, PoTagModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  constructor(
    private router: Router,
    private clienteService: ClienteService,
  ) {}

  get clientes() {
    return this.clienteService.clientes;
  }
  colunas: Array<PoTableColumn> = [
    { property: 'codigo', label: 'Código', width: '8%' },
    { property: 'nome', label: 'Nome' },
    { property: 'email', label: 'E-mail' },
    { property: 'telefone', label: 'Telefone', width: '13%' },
    { property: 'cidade', label: 'Cidade' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      width: '10%',
      labels: [
        { value: 'ativo', color: 'color-11', label: 'Ativo' },
        { value: 'inativo', color: 'color-07', label: 'Inativo' },
        { value: 'pendente', color: 'color-08', label: 'Pendente' },
      ],
    },
  ];

  pageActions = [
    { label: 'Novo', action: this.novo.bind(this), icon: 'an an-plus' },
  ];

  acoes = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (item: any) => this.editar(item),
    },
    {
      label: 'Excluir',
      icon: 'an an-trash',
      type: 'danger',
      action: (item: any) => this.excluir(item),
    },
  ];

  novo() {
    this.router.navigate(['/clientes/novo']);
  }

  editar(item: any) {
    this.router.navigate(['/clientes/editar', item.codigo]);
  }

  excluir(item: any) {
    this.clienteService.remove(item.codigo);
  }
}
