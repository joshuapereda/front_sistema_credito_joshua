import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Rol, RolRequest } from '../models/rol.model';

@Service()
export class RolService {
 // URL base
  urlBase = environment.apiUrl;
  // Inyectamos HttpClient
  http = inject(HttpClient);
  //-----------------------------------//
  //            CRUD ROL              //
  //-----------------------------------//
  funListarRoles() {
    return this.http.get<any[]>(`${this.urlBase}/api/roles`);
  }
}
