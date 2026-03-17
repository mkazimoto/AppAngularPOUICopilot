import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { ClienteEdit } from './clientes/cliente-edit/cliente-edit';
import { Dashboard } from './dashboard/dashboard';
import { Produtos } from './produtos/produtos';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: Clientes },
  { path: 'clientes/novo', component: ClienteEdit },
  { path: 'clientes/editar/:id', component: ClienteEdit },
  { path: 'produtos', component: Produtos },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
