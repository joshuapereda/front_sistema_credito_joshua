import { Ticket } from '@/app/shared/ticket/ticket';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [Ticket, DatePipe,CurrencyPipe],
  selector: 'app-ticket-compra',
  templateUrl: './ticket-compra.html',
  styleUrl: './ticket-compra.css',
})
export class TicketCompra {
  @Input() compra: any;
}
