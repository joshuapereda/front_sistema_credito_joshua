import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { RolFilterCriteria, RolInterface } from '../Interfaces/RolInterface';
import { PermisoInterface } from '../../permisos/Interfaces/PermisoInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class RolService {
  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarRoles() {
    return this.http.get<RolInterface[]>(`${this.urlBase}/api/roles`);
  }
  //Lista pero con paginacion
  funPaginarPago(req: PageableRequest<RolFilterCriteria>) {
      return this.http.post<PageableResponse<RolInterface>>(`${this.urlBase}/api/roles/pagination`, req);
  }
  funListarPermisos() {
    return this.http.get<PermisoInterface[]>(`${this.urlBase}/api/permisos`);
  }
  funGuarda(datos: RolInterface) {
    return this.http.post(`${this.urlBase}/api/roles`, datos);
  }
  funEditar(id: number, datos: RolInterface) {
    return this.http.put(`${this.urlBase}/api/roles/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/roles/${id}`);
  }
}
