import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { TipoCompra, TipoCompraRequest } from '../models/tipo-compra.model';

@Service()
export class TipoCompraService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/tipoCompras`;

  listar(): Observable<TipoCompra[]> {
    return this.http.get<TipoCompra[]>(this.url);
  }

  obtener(id: number): Observable<TipoCompra> {
    return this.http.get<TipoCompra>(`${this.url}/${id}`);
  }

  crear(body: TipoCompraRequest): Observable<TipoCompra> {
    return this.http.post<TipoCompra>(this.url, body);
  }

  actualizar(id: number, body: TipoCompraRequest): Observable<TipoCompra> {
    return this.http.put<TipoCompra>(`${this.url}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
