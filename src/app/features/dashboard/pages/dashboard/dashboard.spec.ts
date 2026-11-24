import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  const texto = () => fixture.nativeElement.textContent as string;
  const peticionResumen = () => http.expectOne((r) => r.url.endsWith('/api/dashboard/resumen'));
  const peticionCobranzas = () => http.expectOne((r) => r.url.endsWith('/api/compra/pagination'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra los números que manda el back', async () => {
    peticionResumen().flush({
      saldoPorCobrar: 3697,
      ventasMes: 10133,
      comprasPendientes: 0,
      totalClientes: 12,
      cobradoHoy: 30,
      productosMasVendidos: [
        { productoId: 1, nombre: 'Polo', cantidad: 10 },
        { productoId: 2, nombre: 'Gorra', cantidad: 5 },
      ],
    });
    await fixture.whenStable();

    expect(texto()).toContain('3,697.00');
    expect(texto()).toContain('10,133.00');
    expect(texto()).toContain('30.00');
    //el 0 se muestra como 0, no como "—"
    const valores = [...fixture.nativeElement.querySelectorAll('p.num')].map((p) =>
      (p as HTMLElement).textContent!.trim(),
    );
    expect(valores[2]).toBe('0');
    //la barra del segundo mide la mitad
    const barras = fixture.nativeElement.querySelectorAll('li .bg-accent');
    expect(barras[0].style.width).toBe('100%');
    expect(barras[1].style.width).toBe('50%');
  });

  it('pide solo pendientes, de la más antigua a la más reciente', async () => {
    const req = peticionCobranzas();
    expect(req.request.body.criterials).toEqual({ estadoCompra: 'PENDIENTE' });
    expect(req.request.body.sortField).toBe('fechaHora');
    expect(req.request.body.sortOrder).toBe('asc');
    req.flush({
      content: [{ id: 6, fechaHora: '2026-11-13T14:42:00', cliente: 'KORINA', total: 224, saldo: 4 }],
      totalElements: 1,
    });
    await fixture.whenStable();
    expect(texto()).toContain('KORINA');
    expect(texto()).toContain('4.00');
  });

  it('si no hay pendientes muestra "Todo cobrado"', async () => {
    peticionCobranzas().flush({ content: [], totalElements: 0 });
    await fixture.whenStable();
    expect(texto()).toContain('Todo cobrado');
  });

  it('si el back falla avisa y no muestra ceros', async () => {
    peticionResumen().flush(null, { status: 500, statusText: 'Error' });
    peticionCobranzas().flush(null, { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    expect(texto()).toContain('No se pudo cargar');
    expect(texto()).not.toContain('Todo cobrado');
    expect(texto()).toContain('—');
  });
});
