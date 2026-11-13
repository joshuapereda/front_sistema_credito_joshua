import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class PagoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPago() {
    return this.http.get<any[]>(`${this.urlBase}/api/pago`);
  }
  funListarCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/compra`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/pago`, datos);
  }
}
