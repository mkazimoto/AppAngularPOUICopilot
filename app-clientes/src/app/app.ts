import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PoMenuItem, PoMenuModule, PoToolbarModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, PoToolbarModule, PoMenuModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Dashboard', link: '/dashboard', icon: 'an an-chart-bar' },
    { label: 'Clientes', link: '/clientes', icon: 'an an-users' },
    { label: 'Produtos', link: '/produtos', icon: 'an an-shopping-bag' },
    { label: 'PetSocial', link: '/petsocial', icon: 'an an-paw-print' },
    { label: 'Aluguel de Carros', link: '/carros', icon: 'an an-car' },
  ];
}
