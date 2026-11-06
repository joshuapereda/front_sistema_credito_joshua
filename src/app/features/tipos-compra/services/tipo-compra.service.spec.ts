import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TipoCompraService } from './tipo-compra.service';

describe('TipoCompraService', () => {
  let service: TipoCompraService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TipoCompraService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET a /api/tipoCompras', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/tipoCompras');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('eliminar hace DELETE a /api/tipoCompras/:id', () => {
    service.eliminar(1).subscribe();
    const req = http.expectOne('/api/tipoCompras/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
