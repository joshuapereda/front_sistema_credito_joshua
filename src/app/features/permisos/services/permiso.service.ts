import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { PermisoInterface } from '../Interfaces/PermisoInterface';

@Service()
export class PermisoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPermiso() {
    return this.http.get<PermisoInterface[]>(`${this.urlBase}/api/permisos`);
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
