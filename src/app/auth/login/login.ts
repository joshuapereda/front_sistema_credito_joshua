import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  //Trabjar con formularios reactivos
  loginForm=new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
  });

  //Definir el router para navegar a otras páginas
  router=inject(Router);

  //inyectar el servicio de autenticacion
  constructor(private authService: AuthService) {}
  funIngresar(){
    this.authService.funcLogin(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        //navegar o direccionar a otra página después del inicio de sesión exitoso
        this.router.navigate(['/dashboard']);
      },
      error: (error:any) => {
       alert("Error al iniciar sesión: " + error.error.message);
      }
    })
  }
}
