import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { BrandMark } from '@/app/shared/components/brand-mark/brand-mark';

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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, BrandMark],
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

  cerrarSesion(): void {
    this.authService.logout();
  }
}
