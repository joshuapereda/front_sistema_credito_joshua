import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * Por defecto el errorInterceptor muestra un toast con cada error HTTP.
 * Si la pantalla prefiere mostrar el error ella misma (por ejemplo, el login),
 * se envía la petición con este contexto:
 *
 *   this.http.post(url, body, { context: sinToastDeError() })
 */
export const OMITIR_TOAST_ERROR = new HttpContextToken<boolean>(() => false);

export const sinToastDeError = () => new HttpContext().set(OMITIR_TOAST_ERROR, true);
