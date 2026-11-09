import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class UserService {
  //url base
  urlBase= environment.apiUrl;
  //inyectamos
  http=inject(HttpClient);
  funListar(){
    return this.http.get(`${this.urlBase}/api/usuarios`);
  }
  funGuarda(datos:any){
    return this.http.post(`${this.urlBase}/api/usuarios`,datos);
  }
  funMostrar(id: number){
    return this.http.get(`${this.urlBase}/api/usuarios`+id);
  }
  funEditar(id: number,datos:any){
    return this.http.patch(`${this.urlBase}/api/usuarios`+id,datos);
  }
  funEliminar(id:number){
    return this.http.delete(`${this.urlBase}/api/usuarios`+id);
  }
}
