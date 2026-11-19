import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { CategoriaInterface } from '../interfaces/CategoriaInterface';

@Service()
export class CategoriaService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarCategoria() {
    return this.http.get<CategoriaInterface[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: FormData) {
    return this.http.post(`${this.urlBase}/api/categorias`, datos);
  }
  funEditar(id: number, datos: FormData) {
    return this.http.put(`${this.urlBase}/api/categorias/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/categorias/${id}`);
  }


}
