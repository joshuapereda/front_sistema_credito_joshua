import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface MenuItem {
  label: string;
  ruta: string;
}

interface MenuGrupo {
  titulo: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  // Al crear una feature nueva: agregar su ruta en app.routes.ts y su item aquí
  protected readonly menu: MenuGrupo[] = [
    {
      titulo: 'General',
      items: [{ label: 'Dashboard', ruta: '/dashboard' }],
    },
    {
      titulo: 'Ventas',
      items: [
        { label: 'Compras', ruta: '/compras' },
        { label: 'Pagos', ruta: '/pagos' },
        { label: 'Clientes', ruta: '/clientes' },
      ],
    },
    {
      titulo: 'Catálogo',
      items: [
        { label: 'Productos', ruta: '/productos' },
        { label: 'Categorías', ruta: '/categorias' },
        { label: 'Tipos de compra', ruta: '/tipos-compra' },
      ],
    },
    {
      titulo: 'Seguridad',
      items: [
        { label: 'Usuarios', ruta: '/usuarios' },
        { label: 'Roles', ruta: '/roles' },
        { label: 'Permisos', ruta: '/permisos' },
      ],
    },
  ];
}
