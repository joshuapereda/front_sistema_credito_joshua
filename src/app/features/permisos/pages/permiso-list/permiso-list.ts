import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PermisoService } from '../../services/permiso.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { PermisoInterface } from '../../Interfaces/PermisoInterface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-permiso-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog],
  templateUrl: './permiso-list.html',
})
export class PermisoList implements OnInit {
  ngOnInit(): void {
    this.funObtenerPermiso();
  }
  protected readonly permisos = signal<PermisoInterface[]>([]);
  private readonly permisoService = inject(PermisoService);
  protected readonly crearPermiso = signal(false);
  //si edito o no - obtener id (-1 = creando)
  protected readonly user_id = signal<number>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly permisoAEliminar = signal<PermisoInterface|null>(null);

  //------------- LISTADO PERMISO ---------------//
  funObtenerPermiso() {
    this.permisoService.funListarPermiso().subscribe({
      next: (permi: PermisoInterface[]) => {
        //guardar en permisos
        this.permisos.set(permi);
      },

      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly permisoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    recurso: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    accion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  //------------- GUARDAR PERMISO --------------//
  funGuardarPermiso() {
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.permisoForm.invalid) {
        this.permisoForm.markAllAsTouched();
        return;
      }
      const { nombre, recurso ,accion} = this.permisoForm.getRawValue();
      const permiso = { nombre, recurso,accion };

      this.permisoService.funEditar(this.user_id(), permiso).subscribe({
        next: () => {
          this.funObtenerPermiso();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar los permisos', err),
      });
    } else {
    //validar si el formualrio esta vacio
    if (this.permisoForm.invalid) {
      this.permisoForm.markAllAsTouched();
      return;
    }

    this.permisoService.funGuarda(this.permisoForm.getRawValue()).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerPermiso()
      },
      error: (error) => { console.log(error) }
    });
  }}
  //------------- EDITAR CATEGORIA ---------------//
  funEditarPermiso(cat: PermisoInterface) {
    //almacenar el id al dar click
    this.user_id.set(cat.id!)
    //precargar los datos ya registrado
    this.permisoForm.patchValue({
      nombre: cat.nombre,
      recurso: cat.recurso,
      accion: cat.accion,
    });
  }
   //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarCategoria(permi: PermisoInterface) {
    this.permisoAEliminar.set(permi);
  }

  cancelarEliminar() {
    this.permisoAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.permisoAEliminar();
    if (!cat) return;

    this.permisoService.funEliminar(cat.id!).subscribe({
      next: () => {
        this.permisoAEliminar.set(null);
        this.funObtenerPermiso();
        this.mensajeExito.set(`EL permiso "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.permisoAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el permiso');
      },
    });
  }
  //---------------- MODALES ----------------//
  abrir(compra: any) {
    this.crearPermiso.set(compra);
  }
  cerrarModal() {
    this.crearPermiso.set(false);
    this.permisoForm.reset({ nombre: '', recurso: '', accion: "" });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearPermiso()) this.cerrarModal();
  }
  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
  }
}
