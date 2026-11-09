import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Producto, ProductoRequest } from '../models/producto.model';

@Service()
export class ProductoService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);
  //-----------------------------------//
  //         CRUD PRODUCTO             //
  //-----------------------------------//
  funListarProducto() {
    return this.http.get<any[]>(`${this.urlBase}/api/productos`);
  }
}
