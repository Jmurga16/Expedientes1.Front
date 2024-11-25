import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../common/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuarioForm } from '../../common/models/usuario-form.interface';
import Swal from 'sweetalert2';

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
  userForm: FormGroup;
  idUsuario: any


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router

  ) {
    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      address: [null],

      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      username: [{ disabled: true, value: null }, [Validators.required, Validators.email]],
      status: [1],
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
  }



  getUser() {

    console.log("get usuario")
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


  getRoles() {
    this.listRoles = [
      { id: "ROLE_ADMIN", nombre: "Administrador" },
      { id: "ROLE_USER", nombre: "Usuario" },
      { id: "ROLE_AREA", nombre: "Referente Area" },
      { id: "ROLE_COLAB", nombre: "Colaborador" }
    ]
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

    if (this.userForm.valid) {

      let request = this.userForm.value as IUsuarioForm;

      if (this.idUsuario) {
        this.usuarioService.update(request).subscribe({
          next: (response: any) => {
            console.log(response)
            Swal.fire({
              title: 'Se guardó correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo guardar el usuario.',
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
              title: 'Se guardó correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo guardar el usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }
    }
  }



}
