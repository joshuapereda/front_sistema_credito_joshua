import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PermisoService } from './permiso.service';

describe('PermisoService', () => {
  let service: PermisoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PermisoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET a /api/permisos', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/permisos');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('eliminar hace DELETE a /api/permisos/:id', () => {
    service.eliminar(1).subscribe();
    const req = http.expectOne('/api/permisos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
