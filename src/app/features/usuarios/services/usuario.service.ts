
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { UsuarioInterface } from '../Interfaces/UsuarioInterface';
import { ClienteInterface } from '../../clientes/interfaces/ClienteInterface';
import { RolInterface } from '../../roles/Interfaces/RolInterface';
import { UsuarioRequest } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarUsuario() {
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/api/usuarios`);
  }
  funListarPersona() {
    return this.http.get<ClienteInterface[]>(`${this.urlBase}/api/clientes`);
  }
  funListarRoles() {
    return this.http.get<RolInterface >(`${this.urlBase}/api/roles`);
  }
  funGuarda(datos: UsuarioInterface) {
    return this.http.post(`${this.urlBase}/api/usuarios`, datos);
  }
  funMostrar(id: number) {
    return this.http.get(`${this.urlBase}/api/usuarios/${id}`);
  }
  funEditar(id: number, datos: UsuarioInterface) {
    return this.http.put(`${this.urlBase}/api/usuarios/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/usuarios/${id}`);
  }
}
