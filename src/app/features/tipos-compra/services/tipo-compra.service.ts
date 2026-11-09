import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { TipoCompra, TipoCompraRequest } from '../models/tipo-compra.model';

@Service()
export class TipoCompraService {
 // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);

  //-----------------------------------//
  //         CRUD TIPO COMPRA          //
  //-----------------------------------//
  funListarTipoCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/tipoCompras`);
  }
}
