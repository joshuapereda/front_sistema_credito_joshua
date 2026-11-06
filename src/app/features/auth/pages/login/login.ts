import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { BrandMark } from '@/app/shared/components/brand-mark/brand-mark';
import { environment } from '@/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, DatePipe, BrandMark],
  templateUrl: './login.html',
})
export class Login {
   //inyectar por costructor
  constructor(private authService: AuthService){}
  protected readonly hoy = new Date();
  protected readonly authSimulado = environment.authSimulado;
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarPassword = signal(false);
  //1-para trabajr con varios fron Control
  protected readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  //inyectar para redireccioanr
  protected readonly router=inject(Router)

   funIngresar(){
      this.authService.funLogin(this.loginForm.value).subscribe({
        next: (res)=>{
          console.log(res);
          this.router.navigate(['/dashboard']);
        },

        error(err: any) {
            alert("Error al ingresar")
        },
      })
   }
}
