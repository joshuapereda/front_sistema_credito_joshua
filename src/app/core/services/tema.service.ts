import { DOCUMENT, inject, Service, signal } from '@angular/core';

export type Tema = 'dia' | 'noche';
const CLAVE_TEMA = 'sc.tema';

//Modo día / noche. Los colores están en src/tema.css
@Service()
export class TemaService {
  private readonly html = inject(DOCUMENT).documentElement;
  readonly tema = signal<Tema>(leerTema());

  //al entrar al sistema: pone el tema guardado
  activar(): void {
    this.html.dataset['tema'] = this.tema();
  }

  //al salir: el login mantiene su propio diseño
  desactivar(): void {
    delete this.html.dataset['tema'];
  }

  //botón de la barra superior
  cambiar(): void {
    this.tema.update((t) => (t === 'dia' ? 'noche' : 'dia'));
    this.activar();
    try {
      localStorage.setItem(CLAVE_TEMA, this.tema()); //recuerda la elección
    } catch {
      //si el navegador no deja guardar, igual cambia
    }
  }
}

function leerTema(): Tema {
  try {
    return localStorage.getItem(CLAVE_TEMA) === 'noche' ? 'noche' : 'dia';
  } catch {
    return 'dia';
  }
}
