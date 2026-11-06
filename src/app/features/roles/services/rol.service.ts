import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Rol, RolRequest } from '../models/rol.model';

@Service()
export class RolService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/roles`;

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  obtener(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  crear(body: RolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.url, body);
  }

  actualizar(id: number, body: RolRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
