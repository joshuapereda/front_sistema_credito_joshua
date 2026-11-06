import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface MenuItem {
  label: string;
  ruta: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  // Cada feature nueva se agrega aquí y en app.routes.ts
  protected readonly menu: MenuItem[] = [
    { label: 'Dashboard', ruta: '/dashboard' },
    { label: 'Categorías', ruta: '/categorias' },
    { label: 'Productos', ruta: '/productos' },
  ];
}
