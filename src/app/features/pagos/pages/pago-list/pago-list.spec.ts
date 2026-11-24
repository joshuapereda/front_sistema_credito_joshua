import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PagoList } from './pago-list';

describe('PagoList', () => {
  let component: PagoList;
  let fixture: ComponentFixture<PagoList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoList);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('el lápiz abre el modal con los datos y guarda el cambio', async () => {
    const pago = {
      id: 9, monto: 50, fechaHora: '2026-11-14T10:00:00', compraId: 2,
      nombreClienteCompra: 'Ana', saldoRestante: 0, totalCompra: 50,
    };
    http.expectOne((r) => r.url.endsWith('/api/pago/pagination')).flush({ content: [pago], totalElements: 1 });
    http.expectOne((r) => r.url.endsWith('/api/compra')).flush([{ id: 2, cliente: 'Ana', saldo: 0 }]);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    el.querySelector<HTMLButtonElement>('[aria-label="Editar pago"]')!.click();
    await fixture.whenStable();
    expect(el.querySelector('.modal h2')!.textContent).toBe('Editar pago');
    const monto = el.querySelector<HTMLInputElement>('#monto')!;
    expect(monto.value).toBe('50');

    monto.value = '40';
    monto.dispatchEvent(new Event('input'));
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    const req = http.expectOne((r) => r.method === 'PUT' && r.url.endsWith('/api/pago/9'));
    expect(+req.request.body.monto).toBe(40);
    req.flush({});
    await fixture.whenStable();

    //se cierra y vuelve a pedir pagos y saldos
    expect(el.querySelector('.modal')).toBeNull();
    http.expectOne((r) => r.url.endsWith('/api/pago/pagination'));
    http.expectOne((r) => r.url.endsWith('/api/compra'));
  });
});
