import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';

// Pendiente HU-08: el backend todavía no expone /api/auth/login
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = `${environment.apiUrl}/auth`;

  funcLogin(credentials: { username: string; password: string }) {
    return this.http.post(`${this.urlBase}/login`, credentials);
  }
}
