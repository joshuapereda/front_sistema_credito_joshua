import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';
import { CompraFilterCriteria, CompraInterface } from '../../compras/interfaces/CompraInterface';
import { DashboardResumenInterface } from '../interfaces/DashboardInterface';

@Service()
export class DashboardService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //Números del dashboard (los calcula el back)
  funObtenerResumen() {
    return this.http.get<DashboardResumenInterface>(`${this.urlBase}/api/dashboard/resumen`);
  }
  //5 compras pendientes, de la más antigua a la más reciente
  funListarCobranzas() {
    const req: PageableRequest<CompraFilterCriteria> = {
      pageNumber: 0,
      pageSize: 5,
      sortField: 'fechaHora',
      sortOrder: 'asc',
      criterials: { estadoCompra: 'PENDIENTE' },
      filterValue: '',
    };
    return this.http.post<PageableResponse<CompraInterface>>(`${this.urlBase}/api/compra/pagination`, req);
  }
}
