import { Routes } from '@angular/router';
import { Carros } from './carros/carros';
import { ClienteEdit } from './clientes/cliente-edit/cliente-edit';
import { Clientes } from './clientes/clientes';
import { Cursos } from './cursos/cursos';
import { Dashboard } from './dashboard/dashboard';
import { Imoveis } from './imoveis/imoveis';
import { Kanban } from './kanban/kanban';
import { Passagens } from './passagens/passagens';
import { Pets } from './pets/pets';
import { Produtos } from './produtos/produtos';
import { Tarefas } from './tarefas/tarefas';
import { Workflow } from './workflow/workflow';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: Clientes },
  { path: 'clientes/novo', component: ClienteEdit },
  { path: 'clientes/editar/:id', component: ClienteEdit },
  { path: 'produtos', component: Produtos },
  { path: 'petsocial', component: Pets },
  { path: 'passagens', component: Passagens },
  { path: 'carros', component: Carros },
  { path: 'cursos', component: Cursos },
  { path: 'imoveis', component: Imoveis },
  { path: 'kanban', component: Kanban },
  { path: 'workflow', component: Workflow },
  { path: 'tarefas', component: Tarefas },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
