export interface ClienteInterface {
  id?:number; //Con el ?, el id puede faltar
  nombre:string;
  gmail:string;
  telefono:string;
  direccion:string;
  docIdentidad:string;
}

export interface ClienteFilterCriteria {
  docIdentidad?: string | null;
  nombrePersona?: string | null;
}
