import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RolService } from './rol.service';

describe('RolService', () => {
  let service: RolService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RolService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET a /api/roles', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/roles');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('eliminar hace DELETE a /api/roles/:id', () => {
    service.eliminar(1).subscribe();
    const req = http.expectOne('/api/roles/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
