import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';

interface MenuItem {
  label: string;
  ruta: string;
  icono: string; //dibujo del ícono (trazo SVG de 24x24)
}

interface MenuGrupo {
  titulo: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hoy = new Date();
  protected readonly usuario = this.authService.usuario;
  protected readonly inicial = computed(() => (this.usuario() ?? '?').charAt(0).toUpperCase());

  /** Menú lateral abierto en pantallas chicas */
  protected readonly menuAbierto = signal(false);

  /** Grupo del menú al que pertenece la ruta actual (se muestra en la barra superior) */
  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly seccionActual = computed(() => {
    const url = this.urlActual();
    const grupo = this.menu.find((g) => g.items.some((i) => url.startsWith(i.ruta)));
    const item = grupo?.items.find((i) => url.startsWith(i.ruta));
    return { grupo: grupo?.titulo ?? '', item: item?.label ?? '' };
  });

  // Al crear una feature nueva: agregar su ruta en app.routes.ts y su item aquí
  protected readonly menu: MenuGrupo[] = [
    {
      titulo: 'General',
      items: [
        { label: 'Dashboard', ruta: '/dashboard', icono: 'M4 4h7v7H4zM14 4h6v5h-6zM14 12h6v8h-6zM4 14h7v6H4z' },
      ],
    },
    {
      titulo: 'Ventas',
      items: [
        { label: 'Compras', ruta: '/compras', icono: 'M3 4h2l2.4 11h10.2L20 7.5H6.2M9 19.5h.01M17 19.5h.01' },
        { label: 'Pagos', ruta: '/pagos', icono: 'M3 7h18v10H3zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4M6.5 12h.01M17.5 12h.01' },
        { label: 'Clientes', ruta: '/clientes', icono: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.4c2.1.8 3.5 2.8 3.5 5.6' },
      ],
    },
    {
      titulo: 'Catálogo',
      items: [
        { label: 'Productos', ruta: '/productos', icono: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9' },
        { label: 'Categorías', ruta: '/categorias', icono: 'M4 4h7.5l8.5 8.5-7.5 7.5L4 11.5zM8 8h.01' },
        { label: 'Tipos de compra', ruta: '/tipos-compra', icono: 'M3 6h18v12H3zM3 10h18M7 15h3' },
      ],
    },
    {
      titulo: 'Seguridad',
      items: [
        { label: 'Usuarios', ruta: '/usuarios', icono: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5' },
        { label: 'Roles', ruta: '/roles', icono: 'M5 3.5h14v17H5zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M8.5 17.5c.3-1.8 1.7-3 3.5-3s3.2 1.2 3.5 3' },
        { label: 'Permisos', ruta: '/permisos', icono: 'M12 3l7.5 3v5.5c0 4.6-3 8-7.5 9.5-4.5-1.5-7.5-4.9-7.5-9.5V6zM9 12l2 2 4-4' },
      ],
    },
  ];

  cerrarSesion(): void {
    this.authService.logout();
  }
}
