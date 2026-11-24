import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { MainLayout } from './main-layout';

@Component({ template: '' })
class Vacia {}

describe('MainLayout', () => {
  let fixture: ComponentFixture<MainLayout>;
  let el: HTMLElement;

  beforeEach(async () => {
    localStorage.removeItem('sc.tema');
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideRouter([{ path: '**', component: Vacia }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MainLayout);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('muestra las 10 opciones, cada una con su ícono', () => {
    const enlaces = [...el.querySelectorAll('nav a')];
    expect(enlaces.length).toBe(10);
    for (const a of enlaces) expect(a.querySelector('path')!.getAttribute('d')).toBeTruthy();
  });

  it('marca solo la opción donde estoy', async () => {
    await TestBed.inject(Router).navigateByUrl('/pagos');
    await fixture.whenStable();
    const activas = el.querySelectorAll('nav .nav-activo');
    expect(activas.length).toBe(1);
    expect(activas[0].textContent!.trim()).toBe('Pagos');
    expect(activas[0].getAttribute('aria-current')).toBe('page');
    expect(el.querySelector('header')!.textContent).toContain('Ventas');
  });

  it('en celular el menú se abre con el botón y se cierra al elegir', async () => {
    const menu = el.querySelector('aside')!;
    expect(menu.classList).toContain('-translate-x-full');
    el.querySelector<HTMLButtonElement>('[aria-label="Abrir menú"]')!.click();
    await fixture.whenStable();
    expect(menu.classList).not.toContain('-translate-x-full');
    el.querySelector<HTMLAnchorElement>('a[href="/clientes"]')!.click();
    await fixture.whenStable();
    expect(menu.classList).toContain('-translate-x-full');
  });

  it('el botón cambia entre día y noche, y al salir quita el tema', async () => {
    const html = document.documentElement;
    const boton = () => el.querySelector<HTMLButtonElement>('header button[title^="Cambiar a modo"]')!;
    expect(html.dataset['tema']).toBe('dia');
    expect(boton().title).toBe('Cambiar a modo noche');

    boton().click();
    await fixture.whenStable();
    expect(html.dataset['tema']).toBe('noche');
    expect(boton().title).toBe('Cambiar a modo día');

    fixture.destroy();
    expect(html.dataset['tema']).toBeUndefined();
  });
});
