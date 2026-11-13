import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class PermisoService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPermiso() {
    return this.http.get<any[]>(`${this.urlBase}/api/permisos`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/permisos`, datos);
  }
}
