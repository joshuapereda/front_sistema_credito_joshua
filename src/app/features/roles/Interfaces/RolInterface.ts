export interface RolInterface{
  id?: number;
  nombre: string;
  descripcion: string;
  permisosId: number[];
}
//Filtros
export interface RolFilterCriteria {
  nombre?: string | null;
}
