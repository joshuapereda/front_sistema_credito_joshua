import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Pago, PagoRequest } from '../models/pago.model';

@Service()
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pago`;

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.url);
  }

  obtener(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.url}/${id}`);
  }

  crear(body: PagoRequest): Observable<Pago> {
    return this.http.post<Pago>(this.url, body);
  }

  actualizar(id: number, body: PagoRequest): Observable<Pago> {
    return this.http.put<Pago>(`${this.url}/${id}`, body);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
