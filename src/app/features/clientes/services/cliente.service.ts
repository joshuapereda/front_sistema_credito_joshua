import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class ClienteService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);

  //-----------------------------------//
  //           CRUD PERSONA            //
  //-----------------------------------//
  funListarPersona() {
    return this.http.get<any[]>(`${this.urlBase}/api/clientes`);
  }

}
