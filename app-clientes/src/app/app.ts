import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PoMenuItem, PoMenuModule, PoToolbarModule } from '@po-ui/ng-components';
import poUiPackage from '@po-ui/ng-components/package.json';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, PoToolbarModule, PoMenuModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly poUiVersion = poUiPackage.version;
  readonly toolbarTitle = `App PO-UI gerado pelo Copilot com o Modelo Claude Sonnet 4.6 - Versão do PO-UI ${this.poUiVersion}`;

  readonly menus: Array<PoMenuItem> = [
    { label: 'Dashboard', shortLabel: 'Dashboard', link: '/dashboard', icon: 'an an-chart-bar' },
    { label: 'Clientes', shortLabel: 'Clientes', link: '/clientes', icon: 'an an-users' },
    { label: 'Produtos', shortLabel: 'Produtos', link: '/produtos', icon: 'an an-shopping-bag' },
    { label: 'PetSocial', shortLabel: 'PetSocial', link: '/petsocial', icon: 'an an-paw-print' },
    { label: 'Passagens Aéreas', shortLabel: 'Passagens', link: '/passagens', icon: 'an an-airplane' },
    { label: 'Aluguel de Carros', shortLabel: 'Carros', link: '/carros', icon: 'an an-car' },
    { label: 'Cursos Online', shortLabel: 'Cursos', link: '/cursos', icon: 'an an-graduation-cap' },
    { label: 'Imóveis', shortLabel: 'Imóveis', link: '/imoveis', icon: 'an an-building' },
    { label: 'Kanban', shortLabel: 'Kanban', link: '/kanban', icon: 'an an-kanban' },
    { label: 'Tarefas / Gantt', shortLabel: 'Tarefas', link: '/tarefas', icon: 'an an-calendar-check' },
    { label: 'Agendamento', shortLabel: 'Agenda', link: '/agendamento', icon: 'an an-calendar' },
    { label: 'Workflow', shortLabel: 'Workflow', link: '/workflow', icon: 'an an-git-branch' },
    { label: 'Organograma', shortLabel: 'Org.', link: '/organograma', icon: 'an an-users' },
    { label: 'Tree View Editável', shortLabel: 'Tree View', link: '/treeview', icon: 'an an-tree-structure' },
    { label: 'Visualizador IFC', shortLabel: 'IFC', link: '/ifc-viewer', icon: 'an an-cube' },
  ];


}
