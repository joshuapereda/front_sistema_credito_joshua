import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

/** Rutas internas: si no hay sesión, manda al login. */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.estaAutenticado() ? true : inject(Router).createUrlTree(['/auth/login']);
};

/** Login: si ya hay sesión, no tiene sentido mostrarlo; manda al dashboard. */
export const invitadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.estaAutenticado() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
