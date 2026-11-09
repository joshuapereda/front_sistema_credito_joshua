import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-form',
  imports: [RouterLink, PageHeader, EmptyState,ReactiveFormsModule],
  templateUrl: './usuario-form.html',
})
export class UsuarioForm {
  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());
  usuarios=signal<any>([]);
  //inyectar servivio que creamos
  private readonly usuarioService = inject(UsuarioService);
  //inyectar para redireccioanr
  protected readonly router=inject(Router)

  //almacenar los roles
  roles = signal<any[]>([]);

  //1-para trabajr con varios fron Control
  protected readonly userForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required,Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required,Validators.minLength(8)] }),
    personaId:new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    //arreglo
    rolesId: new FormControl<number[]>([], {nonNullable: true,validators: [Validators.required]
}),
  });

  /* funGuardarUsuario(){
    this.usuarioService.funGuarda(this.userForm.value).subscribe({
      next:(res)=>{
        this.router.navigate(['/usuarios']);
      }
    })
  }*/
  funGuardarUsuario() {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.userForm.getRawValue();

    const payload = {
      ...value,
      personaId: Number(value.personaId),
      rolesId: value.rolesId.map(Number)
    };

    console.log('Datos enviados:', payload);

    this.usuarioService.funGuarda(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error al guardar usuario:', err);
      }
    });
  }
}
