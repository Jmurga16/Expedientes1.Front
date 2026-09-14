import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

interface IRequisito {
  error: string;
  texto: string;
}

export const PASSWORD_MIN_LENGTH = 8;

const REQUISITOS: IRequisito[] = [
  { error: 'minlength', texto: `Al menos ${PASSWORD_MIN_LENGTH} caracteres` },
  { error: 'upperCase', texto: 'Una letra mayúscula' },
  { error: 'lowerCase', texto: 'Una letra minúscula' },
  { error: 'specialCharacter', texto: 'Un carácter especial (por ejemplo ! @ # $ % & * ?)' },
];

@Component({
  selector: 'app-password-requirements',
  templateUrl: './password-requirements.component.html',
  styleUrl: './password-requirements.component.scss'
})
export class PasswordRequirementsComponent {

  @Input({ required: true }) control!: AbstractControl;

  readonly requisitos = REQUISITOS;

  cumple(requisito: IRequisito): boolean {
    return !!this.control.value && !this.control.hasError(requisito.error);
  }
}
