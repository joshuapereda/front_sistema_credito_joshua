
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);

  //---------------- FUNCIONES ----------------//
  funListarUsuario() {
    return this.http.get(`${this.urlBase}/api/usuarios`);
  }
  funListarPersona() {
    return this.http.get(`${this.urlBase}/api/clientes`);
  }
  funListarRoles() {
    return this.http.get(`${this.urlBase}/api/roles`);
  }
  funGuarda(datos: any) {
    return this.http.post(`${this.urlBase}/api/usuarios`, datos);
  }
  funMostrar(id: number) {
    return this.http.get(`${this.urlBase}/api/usuarios/${id}`);
  }
  funEditar(id: number, datos: any) {
    return this.http.patch(`${this.urlBase}/api/usuarios/${id}`, datos);
  }
  funEliminar(id: number) {
    return this.http.delete(`${this.urlBase}/api/usuarios/${id}`);
  }
}
