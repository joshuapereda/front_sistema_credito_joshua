import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '@/app/core/models/auth.model';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

const CLAVE_SESION = 'sc.sesion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly sesion = signal<Sesion | null>(leerSesion());

  readonly usuario = computed(() => this.sesion()?.username ?? null);
  readonly estaAutenticado = computed(() => this.sesion() !== null);

  //llamar urlBase
  urlBase = environment.apiUrl;
  Http = inject(HttpClient);

  funLogin(credenciales: any) {
    return this.Http.post<any>(`${this.urlBase}/api/auth/login`, credenciales).pipe(
      tap((resp) => {
        const nueva = { ...resp, username: credenciales.username };
        sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
        this.sesion.set(nueva);
      }),
    );
  }

  obtenerToken(): string | null {
    return this.sesion()?.accesToken ?? null;      // doble "s", como está en Session Storage
  }

  obtenerRefreshToken(): string | null {
    return this.sesion()?.refreshToken ?? null;
  }

  refrescar() {
    return this.Http.post<any>(
      `${this.urlBase}/api/auth/refresh-token`,
      null,                                          // sin body
      { headers: { authenticate: `Bearer ${this.obtenerRefreshToken()}` } },
    ).pipe(
      // se mezcla con la sesión actual para conservar el username
      tap((resp) => this.guardar({ ...this.sesion()!, ...resp })),
    );
  }

  logout(): void {
    sessionStorage.removeItem(CLAVE_SESION);
    this.sesion.set(null);
    this.router.navigate(['/auth/login']);
  }

  private guardar(sesion: Sesion): void {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }
}

function leerSesion(): Sesion | null {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION);
    return guardada ? (JSON.parse(guardada) as Sesion) : null;
  } catch {
    return null;
  }
}
