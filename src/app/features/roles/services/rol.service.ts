import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { RolInterface } from '../Interfaces/RolInterface';
import { PermisoInterface } from '../../permisos/Interfaces/PermisoInterface';

@Service()
export class RolService {
  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarRoles() {
    return this.http.get<RolInterface[]>(`${this.urlBase}/api/roles`);
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
