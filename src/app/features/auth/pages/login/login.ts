import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { mensajeDeError } from '@/app/core/interceptors/error.interceptor';
import { BrandMark } from '@/app/shared/components/brand-mark/brand-mark';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, DatePipe, BrandMark],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hoy = new Date();
  protected readonly authSimulado = environment.authSimulado;

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarPassword = signal(false);

  protected readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

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
