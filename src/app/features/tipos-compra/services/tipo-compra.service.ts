import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
@Service()
export class TipoCompraService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarTipoCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/tipoCompras`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/tipoCompras`, datos);
  }
}
