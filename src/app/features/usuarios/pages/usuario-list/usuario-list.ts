import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
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
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const { username, passwprd, personaId, rolesId } = this.usuarioForm.getRawValue();

    const usuario = {
      username,
      passwprd,
      personaId,
      rolesId,
    };

    this.usuarioService.funGuarda(usuario).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerUsuarios();
      },
      error: (error) => console.log(error),
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearUsuario.set(compra);
  }
  cerrarModal() {
    this.crearUsuario.set(false);
    this.usuarioForm.reset({ username: '', passwprd: '', personaId: null, rolesId: [] });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearUsuario()) this.cerrarModal();
  }
}
