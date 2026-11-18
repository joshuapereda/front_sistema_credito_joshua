import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog],
  templateUrl: './usuario-list.html',
})
export class UsuarioList implements OnInit {
  ngOnInit(): void {
    this.funObtenerUsuarios();
    this.funObtenerPersona();
    this.funObtenerRoles();
  }
  protected readonly usuarios = signal<any>([]);
  protected readonly personas = signal<any>([]);
  protected readonly roles = signal<any>([]);
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly crearUsuario = signal(false);
  //si edito o no - obtener id (-1 = creando)
  protected readonly user_id = signal<number>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly usuarioAEliminar = signal<any>(null);

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
      mapa.set(per.id, per.nombre);
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
      mapa.set(rol.id, rol.nombre);
    }
    return mapa;
  });

  //------------- LISTADO USUARIO ---------------//
  funObtenerUsuarios() {
    this.usuarioService.funListarUsuario().subscribe({
      next: (res: any) => {
        this.usuarios.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly usuarioForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    passwprd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    personaId: new FormControl<number | null>(null, Validators.required),
    rolesId: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
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
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
      const { username, passwprd, personaId, rolesId } = this.usuarioForm.getRawValue();
      const usuario = { username, passwprd, personaId, rolesId };

      this.usuarioService.funEditar(this.user_id(), usuario).subscribe({
        next: () => {
          this.funObtenerUsuarios();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar el usuario', err),
      });
    } else {
      //CREAR
      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
      const { username, passwprd, personaId, rolesId } = this.usuarioForm.getRawValue();
      const usuario = { username, passwprd, personaId, rolesId };

      this.usuarioService.funGuarda(usuario).subscribe({
        next: () => {
          this.funObtenerUsuarios();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al guardar el usuario', err),
      });
    }
  }
  //------------- EDITAR ---------------//
  funEditarUsuario(user: any) {
    //almacenar el id al dar click
    this.user_id.set(user.id)
    //precargar los datos ya registrado
    this.usuarioForm.patchValue({
      username: user.username,
      personaId: user.personaId,
      rolesId: user.rolesId,
      passwprd: '',
    });
    //al editar, la contraseña es opcional (vacío = mantener la anterior)
    const pass = this.usuarioForm.controls.passwprd;
    pass.clearValidators();
    pass.updateValueAndValidity();
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarUsuario(user: any) {
    this.usuarioAEliminar.set(user);
  }

  cancelarEliminar() {
    this.usuarioAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.usuarioAEliminar();
    if (!cat) return;

    this.usuarioService.funEliminar(cat.id).subscribe({
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
    this.crearUsuario.set(false);
    //volver a modo "crear"
    this.user_id.set(-1);
    //restaurar la contraseña como obligatoria para el próximo "Nuevo usuario"
    const pass = this.usuarioForm.controls.passwprd;
    pass.setValidators([Validators.required]);
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
