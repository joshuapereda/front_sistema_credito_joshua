import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface ItemMenu {
  label: string;
  ruta: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  // agregar aquí cada módulo nuevo (clientes, productos, compras, pagos...)
  menu: ItemMenu[] = [
    { label: 'Dashboard', ruta: '/dashboard' },
    { label: 'Categorías', ruta: '/categorias' },
  ];
}
