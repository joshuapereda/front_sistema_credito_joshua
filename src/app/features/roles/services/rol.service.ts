import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class RolService {
  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarRoles() {
    return this.http.get<any[]>(`${this.urlBase}/api/roles`);
  }
  funListarPermisos() {
    return this.http.get<any[]>(`${this.urlBase}/api/permisos`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/roles`, datos);
  }
  funEditar(id: number, datos: any) {
    return this.http.put(`${this.urlBase}/api/roles/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/roles/${id}`);
  }
}
