import { Validators } from '@angular/forms';

/**
 * Celular peruano: 9 dígitos y empieza en 9 (misma regla que el backend).
 * Uso: telefono: new FormControl('', [Validators.required, celularPeruValidator])
 * Error en el template: control.hasError('pattern')
 */
export const celularPeruValidator = Validators.pattern(/^9\d{8}$/);
