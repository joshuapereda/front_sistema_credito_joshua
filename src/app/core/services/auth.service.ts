import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Service()
export class AuthService {
  urlBase= environment.apiUrl

  //encargado de enviar peticiones al backend para autenticar a los usuarios
  http=inject(HttpClient)

  //funciones
  funcLogin(credentials: any){
    return this.http.post(`${this.urlBase}/api/auth/login`, credentials);
  }
  funLogout(){}
  funPerfil(){}
}
