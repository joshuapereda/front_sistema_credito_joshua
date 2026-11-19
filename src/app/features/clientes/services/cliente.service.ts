import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { ClienteInterface } from '../interfaces/ClienteInterface';

@Service()
export class ClienteService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPersona() {
    return this.http.get<ClienteInterface[]>(`${this.urlBase}/api/clientes`);
  }
  funGuarda(datos: ClienteInterface) {
    return this.http.post(`${this.urlBase}/api/clientes`, datos);
  }
  funEditar(id: number, datos: ClienteInterface) {
    return this.http.put(`${this.urlBase}/api/clientes/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/clientes/${id}`);
  }

}
