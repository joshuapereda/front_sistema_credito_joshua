import { Component, inject } from '@angular/core';
import { NotificacionService } from '@/app/core/services/notificacion.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  protected readonly notificacionService = inject(NotificacionService);

  protected readonly marca = {
    exito: 'bg-ok',
    error: 'bg-accent',
    info: 'bg-paper/70',
  };

  protected readonly etiqueta = {
    exito: 'Listo',
    error: 'Error',
    info: 'Aviso',
  };
}
