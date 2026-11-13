import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { RolService } from '../../services/rol.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './rol-list.html',
})
export class RolList implements OnInit {
  ngOnInit(): void {
    this.funObtenerRol();
    this.funObtenerPermiso();
  }
  protected readonly roles = signal<any>([]);
  protected readonly permisos = signal<any>([]);
  protected readonly rolService = inject(RolService);
  protected readonly crearRol = signal(false);
  // Orden de las columnas
  private readonly ordenAcciones = ['LISTAR', 'CREAR', 'ACTUALIZAR', 'ELIMINAR'];
  protected readonly busquedaPermiso = signal('');

  //------------- LISTADO PERMISO ---------------//
  funObtenerPermiso() {
    this.rolService.funListarPermisos().subscribe({
      next: (res: any) => {
        this.permisos.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la permiso
  protected readonly permisoPorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const per of this.permisos()) {
      mapa.set(per.id, per.nombre);
    }
    return mapa;
  });

  //------------- LISTADO ROL ---------------//
  funObtenerRol() {
    this.rolService.funListarRoles().subscribe({
      next: (res: any) => {
        this.roles.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly rolForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    permisosId: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });
  //------------- GUARDAR ROL ---------------//
  funGuardarRol() {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    const { nombre, descripcion, permisosId } = this.rolForm.getRawValue();

    const usuario = {
      nombre,
      descripcion,
      permisosId,
    };

    this.rolService.funGuarda(usuario).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerRol();
      },
      error: (error) => console.log(error),
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearRol.set(compra);
  }

  cerrarModal() {
    this.crearRol.set(false);
    this.rolForm.reset({ nombre: '', descripcion: '', permisosId: [] });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearRol()) this.cerrarModal();
  }
  //----------------------------------------------------------------------//
  //     PARA MOSTRARDE FORMA MAS ORDENADA LA SELECCION DE LOS PERMISOS   //
  //----------------------------------------------------------------------//

  // "ACTUALIZAR_DETALLE_COMPRAS" -> { accion: 'ACTUALIZAR', modulo: 'DETALLE_COMPRAS' }
  private parsePermiso(nombre: string) {
    const i = nombre.indexOf('_');
    return i === -1
      ? { accion: nombre, modulo: nombre }
      : { accion: nombre.slice(0, i), modulo: nombre.slice(i + 1) };
  }

  // Columnas que realmente existen en tus permisos
  protected readonly acciones = computed(() => {
    const set = new Set<string>();
    for (const p of this.permisos()) set.add(this.parsePermiso(p.nombre).accion);
    const rank = (a: string) => {
      const i = this.ordenAcciones.indexOf(a);
      return i === -1 ? 99 : i;
    };
    return [...set].sort((a, b) => rank(a) - rank(b));
  });

  // Filas: un módulo con sus permisos por acción
  protected readonly modulos = computed(() => {
    const mapa = new Map<string, Record<string, any>>();
    for (const p of this.permisos()) {
      const { accion, modulo } = this.parsePermiso(p.nombre);
      if (!mapa.has(modulo)) mapa.set(modulo, {});
      mapa.get(modulo)![accion] = p;
    }
    const filtro = this.busquedaPermiso().trim().toLowerCase();
    return [...mapa]
      .filter(([nombre]) => !filtro || nombre.toLowerCase().includes(filtro))
      .map(([nombre, porAccion]) => ({
        nombre,
        porAccion,
        ids: Object.values(porAccion).map((p: any) => p.id as number),
      }));
  });

  protected readonly totalSeleccionados = () =>
    this.rolForm.controls.permisosId.value.length;

  permisoMarcado(id: number): boolean {
    return this.rolForm.controls.permisosId.value.includes(id);
  }

  togglePermiso(id: number, marcado: boolean) {
    const ctrl = this.rolForm.controls.permisosId;
    const actual = ctrl.value;
    ctrl.setValue(marcado ? [...actual, id] : actual.filter(x => x !== id));
    ctrl.markAsTouched();
  }

  // Marcar / desmarcar todo un módulo
  moduloCompleto(ids: number[]): boolean {
    return ids.every(id => this.permisoMarcado(id));
  }

  toggleModulo(ids: number[], marcado: boolean) {
    const ctrl = this.rolForm.controls.permisosId;
    const sinModulo = ctrl.value.filter(x => !ids.includes(x));
    ctrl.setValue(marcado ? [...sinModulo, ...ids] : sinModulo);
    ctrl.markAsTouched();
  }

  // Marcar / desmarcar todo lo visible
  toggleTodos(marcado: boolean) {
    const ctrl = this.rolForm.controls.permisosId;
    const visibles = this.modulos().flatMap(m => m.ids);
    const resto = ctrl.value.filter(x => !visibles.includes(x));
    ctrl.setValue(marcado ? [...resto, ...visibles] : resto);
    ctrl.markAsTouched();
  }

  todosVisiblesMarcados(): boolean {
    const visibles = this.modulos().flatMap(m => m.ids);
    return visibles.length > 0 && visibles.every(id => this.permisoMarcado(id));
  }
}
