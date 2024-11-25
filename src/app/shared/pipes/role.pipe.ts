import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  private rolesMap: { [key: string]: string } = {
    ROLE_ADMIN: 'Administrador',
    ROLE_USER: 'Usuario',
    ROLE_AREA: 'Referente de Área',
    ROLE_COLAB: 'Colaborador',
  };

  transform(value: string): string {
    return this.rolesMap[value] || value;
  }
}