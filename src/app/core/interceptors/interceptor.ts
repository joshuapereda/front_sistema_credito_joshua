import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const esRutaAuth = req.url.includes('/api/auth/');

  const conToken = (r: HttpRequest<unknown>) => {
    const token = auth.obtenerToken();
    return token ? r.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : r;
  };

  return next(esRutaAuth ? req : conToken(req)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !esRutaAuth && auth.obtenerRefreshToken()) {
        return auth.refrescar().pipe(
          switchMap(() => next(conToken(req))),   // repite la petición con el token nuevo
          catchError((e) => {
            auth.logout();                        // el refresh también falló
            return throwError(() => e);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
