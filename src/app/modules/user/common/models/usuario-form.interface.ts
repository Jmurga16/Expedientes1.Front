export interface IUsuarioForm {
  idUsuario?: number,
  idEstado: number,
  idMotivoEstado?: number,
  primerNombre: string,
  segundoNombre?: string,
  primerApellido: string,
  segundoApellido?: string,
  correo: string,
  telefono: string,
  idUsuarioAutoriza: number,
  idTerritorio: number,
  idEstadoRepublica: number,    
  roles: IUsuarioFormRol[],
}

export interface IUsuarioFormRol {
  idRol: number;
}