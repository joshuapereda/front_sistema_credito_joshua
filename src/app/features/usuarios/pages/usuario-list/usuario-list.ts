import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { noVacio, reglas } from '@/app/shared/validators/reglas';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { UsuarioFilterCriteria, UsuarioInterface } from '../../Interfaces/UsuarioInterface';
import { ClienteInterface } from '@/app/features/clientes/interfaces/ClienteInterface';
import { RolInterface } from '@/app/features/roles/Interfaces/RolInterface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';

//misma regla del DTO; al editar puede ir vacía (mantiene la anterior)
const FORMATO_PASSWORD: [ValidatorFn, string] = [
  Validators.pattern(/^(?=[A-Z])(?=.{4,}$)(?=^(?:\D*\d){2,4}\D*$)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]).+$/),
  'El Password debe empezar con mayúscula, tener mínimo 4 caracteres, entre 2 y 4 números, y al menos un símbolo especial',
];
const REGLAS_PASSWORD_CREAR = reglas([noVacio, 'La contraseña es obligatoria'], FORMATO_PASSWORD);
const REGLAS_PASSWORD_EDITAR = reglas(FORMATO_PASSWORD);

@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog, FormsModule, MatPaginatorModule, ErrorCampo, ErroresServidor],
  templateUrl: './usuario-list.html',
})
export class UsuarioList implements OnInit {
  ngOnInit(): void {
    this.funObtenerUsuarios();
    this.funObtenerPersona();
    this.funObtenerRoles();
  }
  protected readonly usuarios = signal<UsuarioInterface[]>([]);
  protected readonly personas = signal<ClienteInterface[]>([]);
  protected readonly roles = signal<RolInterface[]>([]);
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly crearUsuario = signal(false);
  //si edito o no - obtener id (-1 = creando)
  protected readonly user_id = signal<number>(-1);
  //errores del back que no son de un campo
  protected readonly errorServidor = signal<string[]>([]);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly usuarioAEliminar = signal<UsuarioInterface|null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';

  //------------- LISTADO PERSONA ---------------//
  funObtenerPersona() {
    this.usuarioService.funListarPersona().subscribe({
      next: (res: any) => {
        this.personas.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la persona
  protected readonly personaPorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const per of this.personas()) {
      mapa.set(per.id!, per.nombre);
    }
    return mapa;
  });

  //------------- LISTADO ROLES ---------------//
  funObtenerRoles() {
    this.usuarioService.funListarRoles().subscribe({
      next: (res: any) => {
        this.roles.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la roles
  protected readonly rolePorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const rol of this.roles()) {
      mapa.set(rol.id!, rol.nombre);
    }
    return mapa;
  });

  //------------- LISTADO USUARIO ---------------//
  funObtenerUsuarios() {
  //Paginacion y filtrado
    const req: PageableRequest<UsuarioFilterCriteria> = {
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: 'id',
        sortOrder: 'desc',
        criterials: null,
        filterValue: this.filterValue,
    };
    this.usuarioService.funPaginarUsuario(req).subscribe({
      next: (res) => {
        this.usuarios.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerUsuarios();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerUsuarios();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }

  //---------------- FORMULARIO ----------------//
  protected readonly usuarioForm = new FormGroup({
    username: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El Username es obligatorio'],
        [Validators.pattern(/^[A-Z][a-zA-Z]*(\d[a-zA-Z]*){2,4}$/), 'El Username debe empezar con mayúscula y contener entre 2 y 4 números'],
      ),
    }),
    passwprd: new FormControl('', { nonNullable: true, validators: REGLAS_PASSWORD_CREAR }),
    personaId: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'Debe asignar al menos una Persona al Usuario'],
      ),
    }),
    rolesId: new FormControl<number[]>([], { nonNullable: true,
      validators: reglas(
        [noVacio, 'Debe asignar al menos un Rol al usuario'],
      ),
    }),
  });
  //Optener mensaje de error del back
  rolMarcado(id: number): boolean {
    return this.usuarioForm.controls.rolesId.value.includes(id);
  }

  toggleRol(id: number, marcado: boolean) {
    const ctrl = this.usuarioForm.controls.rolesId;
    const actual = ctrl.value;
    ctrl.setValue(marcado ? [...actual, id] : actual.filter(r => r !== id));
    ctrl.markAsTouched();
  }
  //------------- GUARDAR PERSONA ---------------//
  funGuardarUsuario() {
    this.errorServidor.set([]); //borra los errores anteriores
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
      const { username, passwprd, personaId, rolesId } = this.usuarioForm.getRawValue();
      //la contraseña solo se envía si el usuario escribió una nueva
      const usuario: UsuarioInterface = {
        username,
        personaId: personaId!,
        rolesId,
        ...(passwprd ? { passwprd } : {}),
      };

      this.usuarioService.funEditar(this.user_id(), usuario).subscribe({
        next: () => {
          this.funObtenerUsuarios();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.usuarioForm, err)),
      });
    } else {
      //CREAR
      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
      const { username, passwprd, personaId, rolesId } = this.usuarioForm.getRawValue();
      const usuario: UsuarioInterface = { username, passwprd, personaId: personaId!, rolesId };
      this.usuarioService.funGuarda(usuario).subscribe({
        next: () => {
          this.funObtenerUsuarios();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.usuarioForm, err)),
      });
    }
  }
  //------------- EDITAR ---------------//
  funEditarUsuario(user: UsuarioInterface) {
    //almacenar el id al dar click
    this.user_id.set(user.id!)
    //precargar los datos ya registrado
    this.usuarioForm.patchValue({
      username: user.username,
      personaId: user.personaId,
      rolesId: user.rolesId,
      passwprd: '',
    });
    //al editar, la contraseña es opcional (vacío = mantener la anterior)
    const pass = this.usuarioForm.controls.passwprd;
    pass.setValidators(REGLAS_PASSWORD_EDITAR);
    pass.updateValueAndValidity();
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarUsuario(user: UsuarioInterface) {
    this.usuarioAEliminar.set(user);
  }

  cancelarEliminar() {
    this.usuarioAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.usuarioAEliminar();
    if (!cat) return;

    this.usuarioService.funEliminar(cat.id!).subscribe({
      next: () => {
        this.usuarioAEliminar.set(null);
        this.funObtenerUsuarios();
        this.mensajeExito.set(`El usuario "${cat.username}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.usuarioAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el usuario');
      },
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearUsuario.set(compra);
  }
  cerrarModal() {
    this.errorServidor.set([]);
    this.crearUsuario.set(false);
    //volver a modo "crear"
    this.user_id.set(-1);
    //restaurar la contraseña como obligatoria para el próximo "Nuevo usuario"
    const pass = this.usuarioForm.controls.passwprd;
    pass.setValidators(REGLAS_PASSWORD_CREAR);
    this.usuarioForm.reset({ username: '', passwprd: '', personaId: null, rolesId: [] });
    pass.updateValueAndValidity();
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearUsuario()) this.cerrarModal();
  }
  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
  }

}
