import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificacionService } from '@/app/core/services/notificacion.service';

/**
 * Muestra un toast con el mensaje de cualquier error HTTP y lo vuelve a lanzar,
 * por si el componente necesita reaccionar (por ejemplo, quitar un "cargando").
 *
 * El backend todavía no tiene manejo global de errores (HU-05): las reglas de negocio
 * llegan como HTTP 500 con el texto en `error.message`.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacion = inject(NotificacionService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      notificacion.error(obtenerMensaje(error));
      return throwError(() => error);
    }),
  );
};

function obtenerMensaje(error: HttpErrorResponse): string {
  // 0: sin red / CORS. 502-504: el proxy de desarrollo no encontró el backend encendido
  if (error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504) {
    return 'No se pudo conectar con el servidor';
  }
  if (typeof error.error?.message === 'string' && error.error.message) {
    return error.error.message;
  }
  if (error.status === 400) {
    return 'Hay datos inválidos en el formulario';
  }
  if (error.status === 404) {
    return 'No se encontró el recurso solicitado';
  }
  return 'Ocurrió un error inesperado';
}
