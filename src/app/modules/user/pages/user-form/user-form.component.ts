import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../common/services/usuario.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {

  readonly: boolean = false;
  isEdit: boolean = false;

  listRoles: any[] = [];
  listEsadosUsuario: any[] = []
  listMotivoEstado: any[] = []
  listUsuariosAutoriza: any[] = [];
  listTerritorios: any[] = [];
  listEstadosTerritorio: any[] = [];
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioHttp: UsuarioService,
  ) {
    this.userForm = this.formBuilder.group({
      idUsuario: [null],
      primerNombre: [null, [Validators.required]],
      segundoNombre: [null],
      primerApellido: [null, [Validators.required]],
      segundoApellido: [null],
      correo: [null, [Validators.required, Validators.email]],
      telefono: [null],
      cuenta: [{ disabled: true, value: null }, [Validators.required, Validators.email]],
      idUsuarioAutoriza: [null, [Validators.required]],
      idTerritorio: [null, [Validators.required]],
      idEstadoRepublica: [null, [Validators.required]],
      idEstado: [1],
      IdMotivoEstado: [null],
      roles: [null, [Validators.required]]
    });

  }
}
