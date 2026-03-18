import { Routes } from '@angular/router';
import { Carros } from './carros/carros';
import { ClienteEdit } from './clientes/cliente-edit/cliente-edit';
import { Clientes } from './clientes/clientes';
import { Dashboard } from './dashboard/dashboard';
import { Passagens } from './passagens/passagens';
import { Pets } from './pets/pets';
import { Produtos } from './produtos/produtos';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: Clientes },
  { path: 'clientes/novo', component: ClienteEdit },
  { path: 'clientes/editar/:id', component: ClienteEdit },
  { path: 'produtos', component: Produtos },
  { path: 'petsocial', component: Pets },
  { path: 'carros', component: Carros },
  { path: 'passagens', component: Passagens },    
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
