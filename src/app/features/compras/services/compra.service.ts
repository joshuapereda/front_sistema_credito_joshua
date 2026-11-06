import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Compra, CompraRequest } from '../models/compra.model';

@Service()
export class CompraService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/compra`;

  listar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.url);
  }

  obtener(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.url}/${id}`);
  }

  crear(body: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.url, body);
  }

  actualizar(id: number, body: CompraRequest): Observable<Compra> {
    return this.http.put<Compra>(`${this.url}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
