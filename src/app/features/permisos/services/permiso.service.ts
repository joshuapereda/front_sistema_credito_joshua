import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Permiso, PermisoRequest } from '../models/permiso.model';

@Service()
export class PermisoService {
  // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);

  //-----------------------------------//
  //          CRUD PERMISO             //
  //-----------------------------------//
  funListarPermiso() {
    return this.http.get<any[]>(`${this.urlBase}/api/permisos`);
  }
}
