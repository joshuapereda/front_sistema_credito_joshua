import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './cliente-list.html',
})
export class ClienteList implements OnInit {
  ngOnInit(): void {
    this.funObtenerPersona();
  }
  private readonly personas = signal<any>([]);
  private readonly clienteService = inject(ClienteService);
  protected readonly crearCliente = signal(false);
  //mostrar validaciones del back
  protected readonly errorServidor = signal<string[]>([]);

  //------------- LISTADO PERSONA ---------------//
  funObtenerPersona() {
    this.clienteService.funListarPersona().subscribe({
      next: (res: any) => {
        this.personas.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly clienteForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gmail: new FormControl('', { nonNullable: true }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^9\d{8}$/)] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    docIdentidad: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{8}$/)] })
  });
  //------------- GUARDAR PERSONA ---------------//
  funGuardarCategoria() {
    this.errorServidor.set([]);

    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const cliente = this.clienteForm.getRawValue();

    this.clienteService.funGuarda(cliente).subscribe({
      next: () => {
        this.funObtenerPersona();
        this.cerrarModal();
      },
      error: (err) => {
        const msg = err.error?.message;
        this.errorServidor.set(
          Array.isArray(msg) ? msg : [msg ?? 'No se pudo guardar el cliente.']
        );
      },
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearCliente.set(compra);
  }
  cerrarModal() {
    this.crearCliente.set(false);
    this.clienteForm.reset({ nombre: '', gmail: '', telefono: "", direccion: "", docIdentidad: "" });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearCliente()) this.cerrarModal();
  }
}
