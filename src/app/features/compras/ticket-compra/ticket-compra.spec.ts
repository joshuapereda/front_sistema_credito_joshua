import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketCompra } from './ticket-compra';

describe('TicketCompra', () => {
  let component: TicketCompra;
  let fixture: ComponentFixture<TicketCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
