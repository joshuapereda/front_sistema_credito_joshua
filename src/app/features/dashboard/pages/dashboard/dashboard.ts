import { Component } from '@angular/core';
import { PageHeader } from '@/app/shared/components/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  // TODO: indicadores (ventas del día, saldo por cobrar, compras pendientes) y gráficos con chart.js
}
