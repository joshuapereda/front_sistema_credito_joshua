import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { LoginRequest } from '@/app/core/models/auth.model';
import { environment } from '@/environments/environment';

// Pendiente HU-08: el backend todavía no expone /api/auth/login
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  funcLogin(credentials: LoginRequest) {
    return this.http.post(`${this.url}/login`, credentials);
  }

  // Pendiente HU-08: devolver si hay una sesión válida (token guardado, etc.)
  estaAutenticado(): boolean {
    return true;
  }
}
