import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

/**
 * Protege las rutas internas: si no hay sesión, manda al login.
 * Mientras no exista HU-08, AuthService.estaAutenticado() siempre devuelve true.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estaAutenticado() ? true : router.createUrlTree(['/auth/login']);
};
