import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Permiso, PermisoRequest } from '../models/permiso.model';

@Service()
export class PermisoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/permisos`;

  listar(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.url);
  }

  obtener(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.url}/${id}`);
  }

  crear(body: PermisoRequest): Observable<Permiso> {
    return this.http.post<Permiso>(this.url, body);
  }

  actualizar(id: number, body: PermisoRequest): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.url}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
