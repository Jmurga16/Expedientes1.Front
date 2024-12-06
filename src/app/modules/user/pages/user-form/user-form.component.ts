import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../common/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuarioForm } from '../../common/models/usuario-form.interface';
import Swal from 'sweetalert2';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../../shared/directives/password-validator.directive';
import { AreaService } from '../../../area/common/services/area.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  readonly: boolean = false;
  isEdit: boolean = false;
  loading: boolean = false;

  listRoles: any[] = [];
  listEstadosUsuario: any[] = []
  listArea: any = []

  userForm: FormGroup;
  idUsuario: any


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private areaService: AreaService,
    private router: Router

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
      this.idUsuario = params['id']; // Obtén el ID de la ruta
      console.log('User ID:', this.idUsuario);
      if (this.idUsuario) {
        this.getUser();
      }
    });

    this.getRoles()
    this.getEstadosUsuario()
    this.getAreas()
  }

  getUser() {
    this.usuarioService.getById(this.idUsuario).subscribe({
      next: (response: any) => {
        console.log(response)
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
      next: (response: any) => {
        this.listArea = response;
      }
    });
  }

  getRoles() {
    this.listRoles = [
      { id: "ROLE_ADMIN", nombre: "Administrador" },
      { id: "ROLE_USER", nombre: "Usuario" },
      { id: "ROLE_AREA", nombre: "Referente Area" },
      { id: "ROLE_COLAB", nombre: "Colaborador" }
    ]
  }

  haveArea(): boolean {
    let roles = this.userForm.controls['roles'].value;

    if (roles == null) {
      return false;
    }
    else if (roles.includes('ROLE_AREA') || roles.includes('ROLE_COLAB')) {
      return true;
    }
    else {
      return false;
    }

  }

  getEstadosUsuario() {
    this.listEstadosUsuario = [
      { id: 0, nombre: "Inactivo" },
      { id: 1, nombre: "Activo" }
    ]
  }

  goToBack() {
    if (this.idUsuario) {
      this.router.navigate(['../../list'], {
        relativeTo: this.activatedRoute
      });
    }
    else {
      this.router.navigate(['../list'], {
        relativeTo: this.activatedRoute
      });
    }
  }

  onSubmit() {
    console.log(this.userForm.value);
    let request = this.userForm.value as IUsuarioForm;

    if (this.validateForm(request) && this.userForm.valid) {

      if (this.idUsuario) {
        this.usuarioService.update(request).subscribe({
          next: (response: any) => {
            console.log(response)
            Swal.fire({
              title: 'Éxito.',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
            console.error(error)
            Swal.fire({
              title: 'Error!',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }
      else {
        this.usuarioService.create(request).subscribe({
          next: (response: any) => {
            console.log(response)
            Swal.fire({
              title: 'Éxito.',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
            console.error(error)
            Swal.fire({
              title: 'Error!',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }
    }
  }

  validateForm(request: any): boolean {

    let message: string = "";

    if (request.name == null || request.name == "") {
      message = "El campo Nombres es requerido."
    } else if (request.lastname == null || request.lastname == "") {
      message = "El campo Apellidos es requerido."
    } else if (request.dni == null || request.dni == "") {
      message = "El campo DNI es requerido."
    } else if (request.address == null || request.address == "") {
      message = "El campo Domicilio es requerido."
    } else if (request.email == null || request.email == "") {
      message = "El campo Correo Electrónico es requerido."
    } else if (request.password == null || request.password == "") {
      message = "El campo Contraseña es requerido."
    } else if (request.roles == null || request.roles.length == 0) {
      message = "El campo Rol es requerido."
    } else if ((request.roles.includes('ROLE_AREA') || request.roles.includes('ROLE_COLAB')) && request.idArea == null) {
      message = "El campo Área es requerido."
    }


    if (message != "") {
      Swal.fire({
        title: 'Advertencia!',
        text: message,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }

    return message == ""
  }


}
