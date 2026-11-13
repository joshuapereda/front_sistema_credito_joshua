import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Compra, CompraRequest } from '../models/compra.model';

@Service()
export class CompraService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/compra`);
  }
  funListarCliente() {
    return this.http.get<any[]>(`${this.urlBase}/api/clientes`);
  }
  funListarUsuario() {
    return this.http.get<any[]>(`${this.urlBase}/api/usuarios`);
  }
  funListarTipoCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/tipoCompras`);
  }
  funListarProducto() {
    return this.http.get<any[]>(`${this.urlBase}/api/productos`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/compra`, datos);
  }
}
