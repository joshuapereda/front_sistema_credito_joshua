import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { CompraInterface, CompraRequest } from '../interfaces/CompraInterface';
import { ClienteInterface } from '../../clientes/interfaces/ClienteInterface';
import { UsuarioInterface } from '../../usuarios/Interfaces/UsuarioInterface';
import { TipoCompraInterface } from '../../tipos-compra/Interfaces/TipoCompraInterface';
import { ProductoInterface } from '../../productos/interfaces/ProductoInterface';
import { CategoriaInterface } from '../../categorias/interfaces/CategoriaInterface';

@Service()
export class CompraService {

  urlBase = environment.apiUrl;
  http = inject(HttpClient);
  //---------------- FUNCIONES ----------------//
  funListarCompra() {
    return this.http.get<CompraInterface[]>(`${this.urlBase}/api/compra`);
  }
  funListarCliente() {
    return this.http.get<ClienteInterface[]>(`${this.urlBase}/api/clientes`);
  }
  funListarUsuario() {
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/api/usuarios`);
  }
  funListarProducto() {
    return this.http.get<ProductoInterface[]>(`${this.urlBase}/api/productos`);
  }
  funListarTipoCompra() {
    return this.http.get<TipoCompraInterface[]>(`${this.urlBase}/api/tipoCompras`);
  }
  funListarCategoria() {
    return this.http.get<CategoriaInterface[]>(`${this.urlBase}/api/categorias`);
  }
  funGuarda(datos: CompraRequest) {
    return this.http.post(`${this.urlBase}/api/compra`, datos);
  }
  funGuardaProducto(datos: FormData) {
    return this.http.post(`${this.urlBase}/api/productos`, datos);
  }
  funGuardaCliente(datos: ClienteInterface) {
    return this.http.post(`${this.urlBase}/api/clientes`, datos);
  }
  funEditar(id: number, datos: CompraRequest) {
    return this.http.put(`${this.urlBase}/api/compra/${id}`, datos);
  }
}
