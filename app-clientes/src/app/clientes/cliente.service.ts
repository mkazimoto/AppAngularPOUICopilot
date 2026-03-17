import { Injectable } from '@angular/core';

export interface Cliente {
  codigo: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  clientes: Cliente[] = [
    {
      codigo: 1,
      nome: 'Ana Paula Silva',
      email: 'ana.silva@email.com',
      telefone: '(11) 99001-1111',
      cidade: 'São Paulo',
      status: 'ativo',
    },
    {
      codigo: 2,
      nome: 'Bruno Costa',
      email: 'bruno.costa@email.com',
      telefone: '(21) 99002-2222',
      cidade: 'Rio de Janeiro',
      status: 'ativo',
    },
    {
      codigo: 3,
      nome: 'Carla Mendes',
      email: 'carla.mendes@email.com',
      telefone: '(31) 99003-3333',
      cidade: 'Belo Horizonte',
      status: 'inativo',
    },
    {
      codigo: 4,
      nome: 'Diego Rocha',
      email: 'diego.rocha@email.com',
      telefone: '(41) 99004-4444',
      cidade: 'Curitiba',
      status: 'pendente',
    },
    {
      codigo: 5,
      nome: 'Eliane Ferreira',
      email: 'eliane.ferreira@email.com',
      telefone: '(51) 99005-5555',
      cidade: 'Porto Alegre',
      status: 'ativo',
    },
  ];

  getById(codigo: number): Cliente | undefined {
    return this.clientes.find(c => c.codigo === codigo);
  }

  update(updated: Cliente): void {
    const idx = this.clientes.findIndex(c => c.codigo === updated.codigo);
    if (idx !== -1) {
      this.clientes[idx] = { ...updated };
    }
  }

  add(cliente: Omit<Cliente, 'codigo'>): void {
    const nextCodigo = this.clientes.length > 0
      ? Math.max(...this.clientes.map(c => c.codigo)) + 1
      : 1;
    this.clientes.push({ ...cliente, codigo: nextCodigo });
  }

  remove(codigo: number): void {
    this.clientes = this.clientes.filter(c => c.codigo !== codigo);
  }
}
