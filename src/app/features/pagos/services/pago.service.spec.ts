import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PagoService } from './pago.service';

describe('PagoService', () => {
  let service: PagoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PagoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET a /api/pago', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/pago');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('eliminar hace DELETE a /api/pago/:id', () => {
    service.eliminar(1).subscribe();
    const req = http.expectOne('/api/pago/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
