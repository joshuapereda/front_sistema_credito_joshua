import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class ClienteService {
  
  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPersona() {
    return this.http.get<any[]>(`${this.urlBase}/api/clientes`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/clientes`, datos);
  }

}
