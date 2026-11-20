import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { CategoriaFilterCriteria, CategoriaInterface } from '../interfaces/CategoriaInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class CategoriaService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarCategoria() {
    return this.http.get<CategoriaInterface[]>(`${this.urlBase}/api/categorias`);
  }
  //Lista pero con paginacion
  funPaginarPago(req: PageableRequest<CategoriaFilterCriteria>) {
    return this.http.post<PageableResponse<CategoriaInterface>>(`${this.urlBase}/api/categorias/pagination`, req);
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
