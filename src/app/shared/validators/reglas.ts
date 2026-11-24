import { ValidatorFn, Validators } from '@angular/forms';

//Une cada validación con su mensaje (el mismo texto del DTO del back).
//Devuelve solo el primer mensaje que falla, en el orden de la lista.
//Uso: reglas([noVacio, 'El nombre es obligatorio'], [Validators.maxLength(50), 'Máximo 50'])
export function reglas(...lista: [ValidatorFn, string][]): ValidatorFn {
  return (control) => {
    for (const [validador, mensaje] of lista) {
      if (validador(control)) return { mensaje };
    }
    return null;
  };
}

//Igual que @NotBlank / @NotNull / @NotEmpty: los espacios y las listas vacías no cuentan
export const noVacio: ValidatorFn = (control) => {
  const v = control.value;
  const vacio = Array.isArray(v) ? v.length === 0 : String(v ?? '').trim() === '';
  return vacio ? { noVacio: true } : null;
};

//Igual que @Digits: cuántos enteros y cuántos decimales se aceptan
export function digitos(enteros: number, decimales: number): ValidatorFn {
  return Validators.pattern(new RegExp(`^\\d{1,${enteros}}(\\.\\d{1,${decimales}})?$`));
}
