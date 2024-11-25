export interface IUsuarioForm {
  id?: number,
  name: string,
  lastname: string,
  dni: string,
  address?: string,
  username?: string,
  email: string,
  password: string,
  status: number,
  roles: IUsuarioFormRol[],
}

export interface IUsuarioFormRol {
  id: number;
}