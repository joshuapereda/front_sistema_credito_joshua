import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Pago, PagoRequest } from '../models/pago.model';

@Service()
export class PagoService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);
   //-----------------------------------//
  //             CRUD PAGO             //
  //-----------------------------------//
  funListarPago() {
    return this.http.get<any[]>(`${this.urlBase}/api/pago`);
  }
}
