import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TipoCompraList } from './tipo-compra-list';

describe('TipoCompraList', () => {
  let component: TipoCompraList;
  let fixture: ComponentFixture<TipoCompraList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCompraList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoCompraList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
