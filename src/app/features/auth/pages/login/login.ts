import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Formulario reactivo
  protected readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  funIngresar(): void {
    this.authService.funcLogin(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      // El mensaje de error ya lo muestra el errorInterceptor; aquí solo se limpia el estado
      error: () => {},
    });
  }
}
