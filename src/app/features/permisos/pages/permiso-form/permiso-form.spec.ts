import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PermisoForm } from './permiso-form';

describe('PermisoForm', () => {
  let component: PermisoForm;
  let fixture: ComponentFixture<PermisoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
