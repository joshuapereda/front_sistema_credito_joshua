import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { noVacio, reglas } from '@/app/shared/validators/reglas';
import { celularPeruValidator } from '@/app/shared/validators/celular-peru.validator';
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { ClienteFilterCriteria, ClienteInterface } from '../../interfaces/ClienteInterface';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog, FormsModule, MatPaginatorModule, ErrorCampo, ErroresServidor],
  templateUrl: './cliente-list.html',
})
export class ClienteList implements OnInit {
  ngOnInit(): void {
    this.funObtenerPersona();
  }
  private readonly personas = signal<ClienteInterface[]>([]);
  private readonly clienteService = inject(ClienteService);
  protected readonly crearCliente = signal(false);
  //mostrar validaciones del back
  protected readonly errorServidor = signal<string[]>([]);
  //si edito o no - obtener id
  protected readonly user_id = signal<number>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly clienteAEliminar = signal<ClienteInterface | null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';

  //------------- LISTADO PERSONA ---------------//
  funObtenerPersona() {
    //Paginacion y filtrado
    const req: PageableRequest<ClienteFilterCriteria> = {
          pageNumber: this.pageIndex(),
          pageSize: this.pageSize(),
          sortField: 'id',
          sortOrder: 'desc',
          criterials: null,
          filterValue: this.filterValue,
    };
    this.clienteService.funPaginarCliente(req).subscribe({
      next: (res) => {
        this.personas.set(res.content);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerPersona();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerPersona();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }

  //---------------- FORMULARIO ----------------//
  protected readonly clienteForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El Nombre del Cliente es obligatorio'],
        [Validators.maxLength(50), 'El Nombre del cliente no puede tener más de 50 caracteres'],
      ),
    }),
    gmail: new FormControl('', { nonNullable: true,
      validators: reglas(
        [Validators.email, 'Por favor ingresa un Gmail valido'],
      ),
    }),
    telefono: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El N° Teléfono es obligatorio'],
        [celularPeruValidator, 'El N° Teléfono debe ser un celular peruano válido (9 dígitos, empieza con 9)'],
      ),
    }),
    direccion: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'La Direccion de la Cliente es obligatorio'],
      ),
    }),
    docIdentidad: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El D° Identidad es obligatorio'],
        [Validators.pattern(/^\d{8}$/), 'El D° Identidad debe tener 8 dígitos'],
      ),
    }),
  });
  //------------- GUARDAR PERSONA ---------------//
  funGuardarCliente() {
    this.errorServidor.set([]); //borra los errores anteriores
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
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.clienteForm, err)),
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
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.clienteForm, err)),
      });
    }
  }
  //------------- EDITAR CATEGORIA ---------------//
  funEditarCliente(per: ClienteInterface) {
    //almacenar el id al dar click
    this.user_id.set(per.id!)
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
  funEliminarCliente(per: ClienteInterface) {
    this.clienteAEliminar.set(per);
  }

  cancelarEliminar() {
    this.clienteAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.clienteAEliminar();
    if (!cat) return;

    this.clienteService.funEliminar(cat.id!).subscribe({
      next: () => {
        this.clienteAEliminar.set(null);
        this.funObtenerPersona();
        this.mensajeExito.set(`El cliente "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.clienteAEliminar.set(null);
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
  this.user_id.set(-1);   // <- agregar
  this.errorServidor.set([]);
  this.clienteForm.reset({ nombre: '', gmail: '', telefono: '', direccion: '', docIdentidad: '' });
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
