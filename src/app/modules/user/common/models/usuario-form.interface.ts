import { Rol } from './usuario.interface';

export interface IUsuarioForm {
  id: number | null;
  name: string;
  lastname: string;
  dni: string;
  address: string;
  email: string;
  password: string | null;
  status: number;
  idArea: number | null;
  roles: Rol[];
}
