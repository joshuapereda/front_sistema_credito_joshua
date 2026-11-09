import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PermisoList } from './permiso-list';

describe('PermisoList', () => {
  let component: PermisoList;
  let fixture: ComponentFixture<PermisoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
