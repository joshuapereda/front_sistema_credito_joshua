export interface CategoriaInterface {
  id:number;
  nombre:string;
  descripcion:string;
  foto?: string | null;
}
//Filtros
export interface CategoriaFilterCriteria {
  nombre?: string | null;
}
