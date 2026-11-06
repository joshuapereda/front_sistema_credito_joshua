import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, of, tap } from 'rxjs';
import { sinToastDeError } from '@/app/core/http/http-context';
import { LoginRequest, Sesion } from '@/app/core/models/auth.model';
import { environment } from '@/environments/environment';

const CLAVE_SESION = 'sc.sesion';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly sesion = signal<Sesion | null>(leerSesion());

  readonly usuario = computed(() => this.sesion()?.username ?? null);
  readonly estaAutenticado = computed(() => this.sesion() !== null);

  login(credenciales: LoginRequest): Observable<Sesion> {
    // Pendiente HU-08: quitar la rama simulada cuando el backend tenga /api/auth/login
    const peticion = environment.authSimulado
      ? of<Sesion>({ username: credenciales.username }).pipe(delay(700))
      : this.http.post<Sesion>(`${this.url}/login`, credenciales, { context: sinToastDeError() });

    return peticion.pipe(tap((sesion) => this.guardar(sesion)));
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
