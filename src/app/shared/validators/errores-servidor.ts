import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { mensajeDeError } from '@/app/core/interceptors/error.interceptor';

//Reparte los errores del back: cada mensaje va a su campo del formulario.
//Devuelve los que no son de ningún campo (ej. "Esta compra ya está pagada").
export function aplicarErroresServidor(form: FormGroup, err: HttpErrorResponse): string[] {
  const porCampo: Record<string, string> | undefined = err.error?.fieldErrors;

  //sin errores por campo: es un mensaje general
  if (!porCampo) {
    const msg = err.error?.message;
    return Array.isArray(msg) ? msg : [mensajeDeError(err)];
  }

  const generales: string[] = [];
  for (const [campo, mensaje] of Object.entries(porCampo)) {
    const control = form.controls[campo];
    if (control) {
      //se borra solo cuando el usuario cambia el campo
      control.setErrors({ servidor: mensaje });
      control.markAsTouched();
    } else {
      generales.push(mensaje);
    }
  }
  return generales;
}
