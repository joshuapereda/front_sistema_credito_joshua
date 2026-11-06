import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';

interface Indicador {
  etiqueta: string;
  valor: string | null; // null = todavía sin datos
  nota: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, EmptyState],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly usuario = inject(AuthService).usuario;
  protected readonly hoy = new Date();
  protected readonly saludo =
    this.hoy.getHours() < 12
      ? 'Buenos días'
      : this.hoy.getHours() < 19
        ? 'Buenas tardes'
        : 'Buenas noches';

  // TODO: calcular los valores con CompraService / PagoService / ClienteService
  protected readonly indicadores: Indicador[] = [
    {
      etiqueta: 'Saldo por cobrar',
      valor: null,
      nota: 'Suma de saldos pendientes',
      ruta: '/compras',
    },
    { etiqueta: 'Ventas del mes', valor: null, nota: 'Contado y crédito', ruta: '/compras' },
    {
      etiqueta: 'Compras pendientes',
      valor: null,
      nota: 'Con saldo mayor a cero',
      ruta: '/compras',
    },
    { etiqueta: 'Clientes', valor: null, nota: 'Registrados', ruta: '/clientes' },
  ];
}
