import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { noVacio, reglas } from '@/app/shared/validators/reglas';
import { RolService } from '../../services/rol.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { RolFilterCriteria, RolInterface } from '../../Interfaces/RolInterface';
import { PermisoInterface } from '@/app/features/permisos/Interfaces/PermisoInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog, FormsModule, MatPaginatorModule, ErrorCampo, ErroresServidor],
  templateUrl: './rol-list.html',
})
export class RolList implements OnInit {
  ngOnInit(): void {
    this.funObtenerRol();
    this.funObtenerPermiso();
  }
  protected readonly roles = signal<RolInterface[]>([]);
  protected readonly permisos = signal<PermisoInterface[]>([]);
  protected readonly rolService = inject(RolService);
  protected readonly crearRol = signal(false);
  // Orden de las columnas
  private readonly ordenAcciones = ['LISTAR', 'CREAR', 'ACTUALIZAR', 'ELIMINAR'];
  protected readonly busquedaPermiso = signal('');
  //si edito o no - obtener id
  protected readonly user_id = signal<number>(-1);
  //errores del back que no son de un campo
  protected readonly errorServidor = signal<string[]>([]);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  //título del aviso: cambia si se creó, editó o eliminó
  protected readonly tituloExito = signal('');
  protected readonly rolaAEliminar = signal<RolInterface | null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';
  //------------- LISTADO PERMISO ---------------//
  funObtenerPermiso() {
    this.rolService.funListarPermisos().subscribe({
      next: (res: PermisoInterface[]) => {
        this.permisos.set(res);
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la permiso
  protected readonly permisoPorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const per of this.permisos()) {
      mapa.set(per.id!, per.nombre);
    }
    return mapa;
  });

  //------------- LISTADO ROL ---------------//
  funObtenerRol() {
    //Paginacion y filtrado
    const req: PageableRequest<RolFilterCriteria> = {
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: 'id',
        sortOrder: 'desc',
        criterials: null,
        filterValue: this.filterValue,
    };
    this.rolService.funPaginarPago(req).subscribe({
      next: (res) => {
        this.roles.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerRol();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerRol();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }

  //---------------- FORMULARIO ----------------//
  protected readonly rolForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El Nombre del rol es obligatorio'],
      ),
    }),
    descripcion: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'La descripción es obligatoria'],
        [Validators.maxLength(200), 'La Descripción no puede superar los 200 caracteres'],
        [Validators.pattern(/^[a-zA-ZÀ-ÿñÑ0-9 .,()\-]*$/), 'La Descripción contiene caracteres no permitidos'],
      ),
    }),
    permisosId: new FormControl<number[]>([], { nonNullable: true,
      validators: reglas(
        [noVacio, 'Debe asignar al menos un Permiso al Rol'],
      ),
    }),
  });
  //------------- GUARDAR ROL ---------------//
  funGuardarRol() {
    this.errorServidor.set([]); //borra los errores anteriores
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.rolForm.invalid) {
        this.rolForm.markAllAsTouched();
        return;
      }
      const { nombre, descripcion,permisosId } = this.rolForm.getRawValue();
      const rol = { nombre, descripcion ,permisosId};

      this.rolService.funEditar(this.user_id(), rol).subscribe({
        next: () => {
          this.mostrarExito('Rol actualizado', `El rol "${this.rolForm.controls.nombre.value}" se actualizó correctamente.`);
          this.funObtenerRol();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.rolForm, err)),
      });
    } else {
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
          this.mostrarExito('Rol registrado', `El rol "${this.rolForm.controls.nombre.value}" se registró correctamente.`);
          this.cerrarModal();
          this.funObtenerRol();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.rolForm, err)),
      });
    }
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
  //------------- EDITAR ---------------//
  funEditarRol(rol: RolInterface) {
    //almacenar el id al dar click
    this.user_id.set(rol.id!)
    //precargar los datos ya registrado
    this.rolForm.patchValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisosId: rol.permisosId,
    });
  }

  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarRol(rol: RolInterface) {
    this.rolaAEliminar.set(rol);
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearRol.set(compra);
  }

  cerrarModal() {
    this.errorServidor.set([]);
    this.user_id.set(-1); //vuelve a modo "crear"
    this.crearRol.set(false);
    this.rolForm.reset({ nombre: '', descripcion: '', permisosId: [] });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearRol()) this.cerrarModal();
  }
  cancelarEliminar() {
    this.rolaAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.rolaAEliminar();
    if (!cat) return;

    this.rolService.funEliminar(cat.id!).subscribe({
      next: () => {
        this.rolaAEliminar.set(null);
        this.funObtenerRol();
        this.mostrarExito('Rol eliminado', `El rol "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.rolaAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el rol');
      },
    });
  }
  //------------- AVISO DE ÉXITO ---------------//
  //mismo modal verde para crear, editar y eliminar
  mostrarExito(titulo: string, mensaje: string) {
    this.tituloExito.set(titulo);
    this.mensajeExito.set(mensaje);
  }
  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
  }
}
