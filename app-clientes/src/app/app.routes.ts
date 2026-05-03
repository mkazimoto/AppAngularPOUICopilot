import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'clientes',
    loadComponent: () => import('./clientes/clientes').then((m) => m.Clientes),
  },
  {
    path: 'clientes/novo',
    loadComponent: () => import('./clientes/cliente-edit/cliente-edit').then((m) => m.ClienteEdit),
  },
  {
    path: 'clientes/editar/:id',
    loadComponent: () => import('./clientes/cliente-edit/cliente-edit').then((m) => m.ClienteEdit),
  },
  {
    path: 'produtos',
    loadComponent: () => import('./produtos/produtos').then((m) => m.Produtos),
  },
  {
    path: 'petsocial',
    loadComponent: () => import('./pets/pets').then((m) => m.Pets),
  },
  {
    path: 'passagens',
    loadComponent: () => import('./passagens/passagens').then((m) => m.Passagens),
  },
  {
    path: 'carros',
    loadComponent: () => import('./carros/carros').then((m) => m.Carros),
  },
  {
    path: 'cursos',
    loadComponent: () => import('./cursos/cursos').then((m) => m.Cursos),
  },
  {
    path: 'imoveis',
    loadComponent: () => import('./imoveis/imoveis').then((m) => m.Imoveis),
  },
  {
    path: 'kanban',
    loadComponent: () => import('./kanban/kanban').then((m) => m.Kanban),
  },
  {
    path: 'tarefas',
    loadComponent: () => import('./tarefas/tarefas').then((m) => m.Tarefas),
  },
  {
    path: 'agendamento',
    loadComponent: () => import('./agendamento/agendamento').then((m) => m.Agendamento),
  },
  {
    path: 'workflow',
    loadComponent: () => import('./workflow/workflow').then((m) => m.Workflow),
  },
  {
    path: 'organograma',
    loadComponent: () => import('./organograma/organograma').then((m) => m.Organograma),
  },
  {
    path: 'treeview',
    loadComponent: () => import('./treeview/treeview').then((m) => m.Treeview),
  },
  {
    path: 'ifc-viewer',
    loadComponent: () => import('./ifc-viewer/ifc-viewer').then((m) => m.IfcViewer),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
