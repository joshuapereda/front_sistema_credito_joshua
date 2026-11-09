import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Compra, CompraRequest } from '../models/compra.model';

@Service()
export class CompraService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);
  //-----------------------------------//
  //            CRUD COMPRA            //
  //-----------------------------------//
  funListarCompra() {
    return this.http.get<any[]>(`${this.urlBase}/api/compra`);
  }
}
