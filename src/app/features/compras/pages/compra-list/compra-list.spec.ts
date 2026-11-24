import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CompraList } from './compra-list';

describe('CompraList', () => {
  let component: CompraList;
  let fixture: ComponentFixture<CompraList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CompraList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Busca el botón por su texto y le hace clic, como el usuario
  const clic = (texto: string) => {
    const botones: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    botones.find((b) => b.textContent?.trim() === texto)!.click();
  };

  // Devuelve lo que se mandó al back en la paginación y le responde con lista vacía
  const cuerpoEnviado = () => {
    const http = TestBed.inject(HttpTestingController);
    const peticiones = http.match((r) => r.url.endsWith('/api/compra/pagination'));
    expect(peticiones.length).toBe(1);
    peticiones[0].flush({ content: [], pageNumber: 0, pageSize: 5, totalElements: 0, totalPages: 0 });
    return peticiones[0].request.body;
  };

  it('al inicio pide todas las compras', () => {
    expect(cuerpoEnviado().criterials).toEqual({ estadoCompra: null });
  });

  it('cada botón manda su estado al back y Todas quita el filtro', () => {
    cuerpoEnviado(); // carga inicial
    clic('Pendientes');
    expect(cuerpoEnviado().criterials).toEqual({ estadoCompra: 'PENDIENTE' });
    clic('Pagadas');
    expect(cuerpoEnviado().criterials).toEqual({ estadoCompra: 'PAGADO' });
    clic('Todas');
    expect(cuerpoEnviado().criterials).toEqual({ estadoCompra: null });
  });

  it('al filtrar vuelve a la primera página y conserva la búsqueda', () => {
    cuerpoEnviado();
    component.cambiarPagina({ pageIndex: 2, pageSize: 5, length: 20 });
    expect(cuerpoEnviado().pageNumber).toBe(2);
    component['filterValue'] = 'ana';
    clic('Pendientes');
    const body = cuerpoEnviado();
    expect(body.pageNumber).toBe(0);
    expect(body.filterValue).toBe('ana');
  });

  it('marca el botón activo y muestra "Sin resultados"', async () => {
    cuerpoEnviado();
    clic('Pagadas');
    cuerpoEnviado();
    await fixture.whenStable();
    const activo = fixture.nativeElement.querySelector('[aria-pressed="true"]');
    expect(activo.textContent.trim()).toBe('Pagadas');
    expect(fixture.nativeElement.textContent).toContain('Sin resultados');
  });
});
