import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-ticket',
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
})
export class Ticket {
  imprimir() {
    window.print();
  }
}
