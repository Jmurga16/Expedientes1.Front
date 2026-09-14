import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioService } from '../../common/services/usuario.service';
import { IUsuario, Rol } from '../../common/models/usuario.interface';
import { IUsuarioForm } from '../../common/models/usuario-form.interface';
import { IArea } from '../../../area/common/models/area.interface';
import { IOpcion } from '../../../../shared/models/opcion.interface';
import { AreaService } from '../../../area/common/services/area.service';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../../shared/directives/password-validator.directive';
import { LoadingService } from '../../../../shared/services/loading.service';
import { NotificationService } from '../../../../shared/services/notification.service';

const ROLES: IOpcion<Rol>[] = [
  { id: 'ROLE_ADMIN', nombre: 'Administrador' },
  { id: 'ROLE_USER', nombre: 'Usuario' },
  { id: 'ROLE_AREA', nombre: 'Referente Area' },
  { id: 'ROLE_COLAB', nombre: 'Colaborador' },
];

const ESTADOS: IOpcion<number>[] = [
  { id: 0, nombre: 'Inactivo' },
  { id: 1, nombre: 'Activo' },
];

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  readonly: boolean = false;
  isEdit: boolean = false;
  loading: boolean = false;
  saving: boolean = false;

  listRoles: IOpcion<Rol>[] = ROLES;
  listEstadosUsuario: IOpcion<number>[] = ESTADOS;
  listArea: IArea[] = [];

  userForm: FormGroup;
  idUsuario?: number

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private areaService: AreaService,
    private loadingService: LoadingService,
    private notification: NotificationService,
  ) {

    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      address: [null],

      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, upperCaseValidator(), lowerCaseValidator(), specialCharacterValidator()]],
      username: [{ disabled: true, value: null }, [Validators.required, Validators.email]],
      status: [1],
      idArea: [null],
      roles: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['id'];
      if (this.idUsuario) {
        this.userForm.controls['password'].removeValidators(Validators.required);
        this.userForm.controls['password'].updateValueAndValidity();
        this.getUser();
      }
    });

    this.getAreas()
  }

  getUser() {
    this.usuarioService.getById(this.idUsuario!).subscribe({
      next: (response: IUsuario) => {
        this.userForm.patchValue(response);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAreas() {
    this.areaService.getActives().subscribe({
      next: (response: IArea[]) => {
        this.listArea = response;
      }
    });
  }

  haveArea(): boolean {
    const roles: Rol[] | null = this.userForm.controls['roles'].value;
    return roles != null && (roles.includes('ROLE_AREA') || roles.includes('ROLE_COLAB'));
  }

  goToBack() {
    this.router.navigate([this.idUsuario ? '../../list' : '../list'], {
      relativeTo: this.activatedRoute
    });
  }

  onSubmit() {
    if (this.saving) {
      return;
    }

    const request: IUsuarioForm = this.userForm.value;

    if (!this.validateForm(request)) {
      return;
    }

    if (this.userForm.invalid) {
      this.notification.warning(this.userForm.controls['password'].invalid
        ? 'La contraseña debe tener mayúsculas, minúsculas y un carácter especial.'
        : 'Revise los datos del formulario.');
      return;
    }

    this.saving = true;
    this.loadingService.show();

    const peticion = this.idUsuario ? this.usuarioService.update(request) : this.usuarioService.create(request);

    peticion.pipe(finalize(() => this.onSaveFinished())).subscribe({
      next: (response) => {
        this.notification.success(response.message);
        this.goToBack();
      }
    });
  }

  private onSaveFinished() {
    this.saving = false;
    this.loadingService.hide();
  }

  validateForm(request: IUsuarioForm): boolean {
    let message: string = "";

    if (!request.name) {
      message = "El campo Nombres es requerido."
    } else if (!request.lastname) {
      message = "El campo Apellidos es requerido."
    } else if (!request.dni) {
      message = "El campo DNI es requerido."
    } else if (!request.address) {
      message = "El campo Domicilio es requerido."
    } else if (!request.email) {
      message = "El campo Correo Electrónico es requerido."
    } else if (!this.idUsuario && !request.password) {
      message = "El campo Contraseña es requerido."
    } else if (request.roles == null || request.roles.length == 0) {
      message = "El campo Rol es requerido."
    } else if ((request.roles.includes('ROLE_AREA') || request.roles.includes('ROLE_COLAB')) && request.idArea == null) {
      message = "El campo Área es requerido."
    }

    if (message != "") {
      this.notification.warning(message);
    }

    return message == ""
  }
}
