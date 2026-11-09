import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Categoria, CategoriaRequest } from '../models/categoria.model';

@Service()
export class CategoriaService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);
  //-----------------------------------//
  //          CRUD CATEGORIA           //
  //-----------------------------------//
  funListarCategoria() {
    return this.http.get<any[]>(`${this.urlBase}/api/categorias`);
  }
}
