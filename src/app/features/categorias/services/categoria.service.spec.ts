import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoriaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET a /api/categorias', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/categorias');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('eliminar hace DELETE a /api/categorias/:id', () => {
    service.eliminar(1).subscribe();
    const req = http.expectOne('/api/categorias/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
