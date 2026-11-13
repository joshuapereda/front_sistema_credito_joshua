import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PermisoService } from '../../services/permiso.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-permiso-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './permiso-list.html',
})
export class PermisoList implements OnInit {
  ngOnInit(): void {
    this.funObtenerPermiso();
  }
  protected readonly permisos = signal<any[]>([]);
  private readonly permisoService = inject(PermisoService);
  protected readonly crearPermiso = signal(false);

  //------------- LISTADO PERMISO ---------------//
  funObtenerPermiso() {
    this.permisoService.funListarPermiso().subscribe({
      next: (res: any) => {
        //guardar en permisos
        this.permisos.set(res);
      },

      error: (error) => {
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
}
