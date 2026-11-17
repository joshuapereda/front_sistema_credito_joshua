import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class CategoriaService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarCategoria() {
    return this.http.get<any[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/categorias`, datos);
  }
  funEditar(id: number, datos: any) {
    return this.http.put(`${this.urlBase}/api/categorias/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/categorias/${id}`);
  }


}
