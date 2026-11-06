import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { mensajeDeError } from '@/app/core/interceptors/error.interceptor';
import { BrandMark } from '@/app/shared/components/brand-mark/brand-mark';
import { environment } from '@/environments/environment';

/**
 * Login con forma de ticket de caja: sale de la ranura de una ticketera
 * y el código de barras se arma con el usuario que se va escribiendo.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, DatePipe, BrandMark],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly authSimulado = environment.authSimulado;
  protected readonly ahora = signal(new Date());

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarPassword = signal(false);

  protected readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly username = toSignal(this.loginForm.controls.username.valueChanges, {
    initialValue: '',
  });

  /** Barras del código: ancho 1–3 px derivado de cada letra del usuario */
  protected readonly barras = computed(() => generarBarras(this.username() || 'credito'));
  protected readonly codigo = computed(() => codigoDe(this.username() || 'credito'));

  constructor() {
    const reloj = setInterval(() => this.ahora.set(new Date()), 15_000);
    inject(DestroyRef).onDestroy(() => clearInterval(reloj));
  }

  ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: HttpErrorResponse) => this.error.set(mensajeDeError(err)),
      });
  }
}

function hash(texto: string): number {
  let h = 2166136261;
  for (const c of texto) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function generarBarras(texto: string): number[] {
  const barras: number[] = [];
  let h = hash(texto.toLowerCase());
  for (let i = 0; i < 46; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    barras.push((h % 3) + 1);
  }
  return barras;
}

function codigoDe(texto: string): string {
  return hash(texto.toLowerCase())
    .toString()
    .padStart(10, '0')
    .replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}
