import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

@Service()
export class CategoriaService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarCategoria() {
    return this.http.get<any[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/categorias`, datos);
  }


}
