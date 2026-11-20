import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { ProductoFilterCriteria, ProductoInterface } from '../interfaces/ProductoInterface';
import { CategoriaInterface } from '../../categorias/interfaces/CategoriaInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class ProductoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarProducto() {
    return this.http.get<ProductoInterface[]>(`${this.urlBase}/api/productos`);
  }
  //Lista pero con paginacion
  funPaginarProducto(req: PageableRequest<ProductoFilterCriteria>) {
      return this.http.post<PageableResponse<ProductoInterface>>(`${this.urlBase}/api/productos/pagination`, req);
  }
  funListarCategoria() {
    return this.http.get<CategoriaInterface[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: FormData) {
    return this.http.post(`${this.urlBase}/api/productos`, datos);
  }
  funEditar(id: number, datos: FormData) {
    return this.http.put(`${this.urlBase}/api/productos/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/productos/${id}`);
  }
}
