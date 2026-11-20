import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { PermisoFilterCriteria, PermisoInterface } from '../Interfaces/PermisoInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class PermisoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPermiso() {
    return this.http.get<PermisoInterface[]>(`${this.urlBase}/api/permisos`);
  }
  //Lista pero con paginacion
  funPaginarPermiso(req: PageableRequest<PermisoFilterCriteria>) {
    return this.http.post<PageableResponse<PermisoInterface>>(`${this.urlBase}/api/permisos/pagination`, req);
  }
  funGuarda(datos: PermisoInterface) {
    return this.http.post(`${this.urlBase}/api/permisos`, datos);
  }
  funEditar(id: number, datos: PermisoInterface) {
    return this.http.put(`${this.urlBase}/api/permisos/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/permisos/${id}`);
  }
}
