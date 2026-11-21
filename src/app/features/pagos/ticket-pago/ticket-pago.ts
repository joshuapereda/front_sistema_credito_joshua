import { Ticket } from '@/app/shared/ticket/ticket';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [Ticket,DatePipe,CurrencyPipe],
  selector: 'app-ticket-pago',
  templateUrl: './ticket-pago.html',
})
export class TicketPago {
  @Input() pago: any;
}
