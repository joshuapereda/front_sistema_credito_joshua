import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { PagoFilterCriteria, PagoInterface, PagoRequest } from '../Interfaces/PagoInterface';
import { CompraInterface } from '../../compras/interfaces/CompraInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class PagoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPago() {
    return this.http.get<PagoInterface[]>(`${this.urlBase}/api/pago`);
  }
  //Lista pero con paginacion
  funPaginarPago(req: PageableRequest<PagoFilterCriteria>) {
      return this.http.post<PageableResponse<PagoInterface>>(`${this.urlBase}/api/pago/pagination`, req);
  }
  funListarCompra() {
    return this.http.get<CompraInterface[]>(`${this.urlBase}/api/compra`);
  }
  funGuarda(datos: PagoRequest) {
    return this.http.post(`${this.urlBase}/api/pago`, datos);
  }
  funEditar(id: number, datos: PagoRequest) {
    return this.http.put(`${this.urlBase}/api/pago/${id}`, datos);
  }
}
