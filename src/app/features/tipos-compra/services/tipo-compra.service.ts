import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { TipoCompraInterface } from '../Interfaces/TipoCompraInterface';
@Service()
export class TipoCompraService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarTipoCompra() {
    return this.http.get<TipoCompraInterface[]>(`${this.urlBase}/api/tipoCompras`);
  }
  funGuarda(datos: TipoCompraInterface) {
    return this.http.post(`${this.urlBase}/api/tipoCompras`, datos);
  }
  funEditar(id: number, datos: TipoCompraInterface) {
    return this.http.put(`${this.urlBase}/api/tipoCompras/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/tipoCompras/${id}`);
  }
}
