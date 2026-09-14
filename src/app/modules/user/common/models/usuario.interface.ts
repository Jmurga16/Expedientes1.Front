export type Rol = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_AREA' | 'ROLE_COLAB';

export interface IUsuario {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  address: string;
  email: string;
  username: string;
  roles: Rol[];
  idArea: number | null;
  status: number;
}
