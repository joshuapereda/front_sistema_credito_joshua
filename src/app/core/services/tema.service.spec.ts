import { TestBed } from '@angular/core/testing';
import { TemaService } from './tema.service';

describe('TemaService', () => {
  const html = document.documentElement;

  beforeEach(() => localStorage.removeItem('sc.tema'));
  afterEach(() => {
    delete html.dataset['tema'];
    localStorage.removeItem('sc.tema');
  });

  it('empieza en día y solo se aplica al activarlo', () => {
    const tema = TestBed.inject(TemaService);
    expect(tema.tema()).toBe('dia');
    expect(html.dataset['tema']).toBeUndefined();
    tema.activar();
    expect(html.dataset['tema']).toBe('dia');
  });

  it('cambia a noche, vuelve a día y recuerda la elección', () => {
    const tema = TestBed.inject(TemaService);
    tema.cambiar();
    expect(html.dataset['tema']).toBe('noche');
    expect(localStorage.getItem('sc.tema')).toBe('noche');
    tema.cambiar();
    expect(html.dataset['tema']).toBe('dia');
    expect(localStorage.getItem('sc.tema')).toBe('dia');
  });

  it('al volver a entrar usa el tema guardado', () => {
    localStorage.setItem('sc.tema', 'noche');
    expect(TestBed.inject(TemaService).tema()).toBe('noche');
  });

  it('un valor raro guardado no rompe nada: usa día', () => {
    localStorage.setItem('sc.tema', 'xyz');
    expect(TestBed.inject(TemaService).tema()).toBe('dia');
  });

  it('al salir quita el tema para no afectar el login', () => {
    const tema = TestBed.inject(TemaService);
    tema.activar();
    tema.desactivar();
    expect(html.dataset['tema']).toBeUndefined();
  });
});
