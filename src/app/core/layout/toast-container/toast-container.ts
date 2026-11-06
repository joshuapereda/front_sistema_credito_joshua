import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { NotificacionService } from '@/app/core/services/notificacion.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgClass],
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  protected readonly notificacionService = inject(NotificacionService);

  protected readonly estilos = {
    exito: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-sky-600',
  };
}
