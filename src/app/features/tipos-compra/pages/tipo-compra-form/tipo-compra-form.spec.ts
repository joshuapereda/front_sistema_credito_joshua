import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TipoCompraForm } from './tipo-compra-form';

describe('TipoCompraForm', () => {
  let component: TipoCompraForm;
  let fixture: ComponentFixture<TipoCompraForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCompraForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoCompraForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
