import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CompraDetalle } from './compra-detalle';

describe('CompraDetalle', () => {
  let component: CompraDetalle;
  let fixture: ComponentFixture<CompraDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraDetalle],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CompraDetalle);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
