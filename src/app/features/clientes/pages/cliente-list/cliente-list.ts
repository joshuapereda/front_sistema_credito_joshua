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
  //si edito o no - obtener id
  protected readonly user_id = signal<any>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly clienteaAEliminar = signal<any>(null);

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
  funGuardarCliente() {
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.clienteForm.invalid) {
        this.clienteForm.markAllAsTouched();
        return;
      }
      const { nombre, gmail, telefono, direccion, docIdentidad } = this.clienteForm.getRawValue();
      const tcompra = { nombre, gmail, telefono, direccion, docIdentidad };

      this.clienteService.funEditar(this.user_id(), tcompra).subscribe({
        next: () => {
          this.funObtenerPersona();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar el cliente', err),
      });
    } else {
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
  }
  //------------- EDITAR CATEGORIA ---------------//
  funEditarCliente(per: any) {
    //almacenar el id al dar click
    this.user_id.set(per.id)
    //precargar los datos ya registrado
    this.clienteForm.patchValue({
      nombre: per.nombre,
      gmail: per.gmail,
      telefono: per.telefono,
      direccion: per.direccion,
      docIdentidad: per.docIdentidad,
    });
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarCliente(per: any) {
    this.clienteaAEliminar.set(per);
  }

  cancelarEliminar() {
    this.clienteaAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.clienteaAEliminar();
    if (!cat) return;

    this.clienteService.funEliminar(cat.id).subscribe({
      next: () => {
        this.clienteaAEliminar.set(null);
        this.funObtenerPersona();
        this.mensajeExito.set(`El cliente "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.clienteaAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el cliente');
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
  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
  }
}
