import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { ClienteFilterCriteria, ClienteInterface } from '../interfaces/ClienteInterface';
import { PageableRequest, PageableResponse } from '@/app/shared/interfaces/pageable.interface';

@Service()
export class ClienteService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarPersona() {
    return this.http.get<ClienteInterface[]>(`${this.urlBase}/api/clientes`);
  }
  //Lista pero con paginacion
  funPaginarCliente(req: PageableRequest<ClienteFilterCriteria>) {
        return this.http.post<PageableResponse<ClienteInterface>>(`${this.urlBase}/api/clientes/pagination`, req);
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
