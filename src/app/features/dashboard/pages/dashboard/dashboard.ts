import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CompraInterface } from '@/app/features/compras/interfaces/CompraInterface';
import { DashboardResumenInterface } from '../../interfaces/DashboardInterface';
import { DashboardService } from '../../services/dashboard.service';

interface Indicador {
  etiqueta: string;
  valor: number | null; // null = todavía sin datos
  esMoneda: boolean; // true = se muestra como S/ 0.00
  nota: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, EmptyState, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  protected readonly usuario = inject(AuthService).usuario;
  protected readonly hoy = new Date();
  protected readonly saludo =
    this.hoy.getHours() < 12
      ? 'Buenos días'
      : this.hoy.getHours() < 19
        ? 'Buenas tardes'
        : 'Buenas noches';

  private readonly dashboardService = inject(DashboardService);
  //null = todavía no llega la respuesta del back
  protected readonly resumen = signal<DashboardResumenInterface | null>(null);
  protected readonly cobranzas = signal<CompraInterface[] | null>(null);
  //true = la petición falló
  protected readonly errorResumen = signal(false);
  protected readonly errorCobranzas = signal(false);

  ngOnInit(): void {
    this.funObtenerResumen();
    this.funObtenerCobranzas();
  }

  //---------------- CONSUMO DE LA API ----------------//
  funObtenerResumen() {
    this.dashboardService.funObtenerResumen().subscribe({
      next: (res) => this.resumen.set(res),
      error: () => this.errorResumen.set(true), //el interceptor ya muestra el mensaje
    });
  }
  funObtenerCobranzas() {
    this.dashboardService.funListarCobranzas().subscribe({
      next: (res) => this.cobranzas.set(res.content),
      error: () => this.errorCobranzas.set(true),
    });
  }

  //---------------- TARJETAS ----------------//
  //computed: se recalcula solo cuando llega el resumen
  protected readonly indicadores = computed<Indicador[]>(() => {
    const r = this.resumen();
    return [
      {
        etiqueta: 'Saldo por cobrar',
        valor: r?.saldoPorCobrar ?? null,
        esMoneda: true,
        nota: 'Suma de saldos pendientes',
        ruta: '/compras',
      },
      {
        etiqueta: 'Ventas del mes',
        valor: r?.ventasMes ?? null,
        esMoneda: true,
        nota: 'Contado y crédito',
        ruta: '/compras',
      },
      {
        etiqueta: 'Compras pendientes',
        valor: r?.comprasPendientes ?? null,
        esMoneda: false,
        nota: 'Con saldo mayor a cero',
        ruta: '/compras',
      },
      {
        etiqueta: 'Clientes',
        valor: r?.totalClientes ?? null,
        esMoneda: false,
        nota: 'Registrados',
        ruta: '/clientes',
      },
    ];
  });

  //---------------- MÁS VENDIDOS ----------------//
  //ancho de la barra: el producto más vendido ocupa el 100%
  protected anchoBarra(cantidad: number): number {
    const mayor = this.resumen()?.productosMasVendidos[0]?.cantidad ?? 0;
    return mayor > 0 ? (cantidad / mayor) * 100 : 0;
  }
}
