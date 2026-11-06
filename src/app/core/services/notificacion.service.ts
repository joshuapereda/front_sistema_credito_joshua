import { Service, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

/**
 * Mensajes flotantes (toasts) de toda la app.
 * Uso: inject(NotificacionService).exito('Categoría creada');
 * Los errores HTTP ya los muestra el errorInterceptor, no hace falta repetirlos.
 */
@Service()
export class NotificacionService {
  private readonly duracionMs = 4000;
  private siguienteId = 1;

  readonly notificaciones = signal<Notificacion[]>([]);

  exito(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }

  cerrar(id: number): void {
    this.notificaciones.update((lista) => lista.filter((n) => n.id !== id));
  }

  private mostrar(tipo: TipoNotificacion, mensaje: string): void {
    const id = this.siguienteId++;
    this.notificaciones.update((lista) => [...lista, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), this.duracionMs);
  }
}
