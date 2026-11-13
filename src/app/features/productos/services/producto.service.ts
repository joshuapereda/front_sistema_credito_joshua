import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class ProductoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarProducto() {
    return this.http.get<any[]>(`${this.urlBase}/api/productos`);
  }
  funListarCategoria() {
    return this.http.get<any[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/productos`, datos);
  }
}
