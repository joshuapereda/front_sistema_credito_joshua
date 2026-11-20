export interface PermisoInterface{
  id?: number;
  nombre: string;
  recurso: string;
  accion: string;
}
//Filtros
export interface PermisoFilterCriteria {
  nombre?: string | null;
}
