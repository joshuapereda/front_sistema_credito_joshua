import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketPago } from './ticket-pago';

describe('TicketPago', () => {
  let component: TicketPago;
  let fixture: ComponentFixture<TicketPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPago],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPago);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
