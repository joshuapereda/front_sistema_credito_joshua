import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { PagoInterface, PagoRequest } from '../Interfaces/PagoInterface';
import { CompraInterface } from '../../compras/interfaces/CompraInterface';

@Service()
export class PagoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPago() {
    return this.http.get<PagoInterface[]>(`${this.urlBase}/api/pago`);
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
