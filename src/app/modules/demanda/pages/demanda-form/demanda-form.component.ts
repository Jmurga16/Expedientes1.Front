import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandaService } from '../../common/services/demanda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDemandaForm } from '../../common/models/demanda-form.interface';
import Swal from 'sweetalert2';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../../shared/directives/password-validator.directive';
import { AreaService } from '../../../area/common/services/area.service';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';
import { DataService } from '../../../../shared/services/data.service';

@Component({
  selector: 'app-demanda-form',
  templateUrl: './demanda-form.component.html',
  styleUrl: './demanda-form.component.scss'
})
export class DemandaFormComponent {
  headerTitle: string = "Gestión de Demandas"
  readonly: boolean = false;
  isEdit: boolean = false;
  loading: boolean = false;

  listRoles: any[] = [];
  listEstadosDemanda: any[] = []

  listArea: any = []
  listTipoDemanda: any[] = []
  listTipologia: any[] = []
  listSubtipologia: any[] = []

  demandaForm: FormGroup;
  idDemanda: any


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private areaService: AreaService,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dataService: DataService,
    private router: Router

  ) {

    this.demandaForm = this.formBuilder.group({
      id: [null],

      name: [null],
      lastname: [null],
      dni: [null],
      address: [null],
      email: [null],

      idTipoDemanda: [null],
      idTipologia: [null],
      idSubtipologia: [null],
      descripcion: [null],

      domicilio: [null],
      prioridad: [null],
      estado: [1]
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idDemanda = params['id']; // Obtén el ID de la ruta
      console.log('Demanda ID:', this.idDemanda);
      if (this.idDemanda) {
        this.getDemanda();
      }
    });

    this.getRoles()
    this.getEstadosDemanda()
    this.getAreas()
    this.getTipologia();
    this.getTipoDemanda();
  }

  getDemanda() {
    this.demandaService.getById(this.idDemanda).subscribe({
      next: (response: any) => {
        console.log(response)
        this.demandaForm.patchValue(response);
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

  getTipoDemanda() {
    this.dataService.getTipoDemanda().subscribe({
      next: (response: any) => {
        this.listTipoDemanda = response;
      }
    });
  }

  getTipologia() {
    this.tipologiaService.getActives().subscribe({
      next: (response: any) => {
        this.listTipologia = response;
      }
    });
  }

  getSubtipologia(idTipologia: number) {
    this.subtipologiaService.getByIdTipologia(idTipologia).subscribe({
      next: (response: any) => {
        this.listSubtipologia = response;
      }
    });
  }

  getRoles() {
    this.listRoles = [
      { id: "ROLE_ADMIN", nombre: "Administrador" },
      { id: "ROLE_USER", nombre: "Demanda" },
      { id: "ROLE_AREA", nombre: "Referente Area" },
      { id: "ROLE_COLAB", nombre: "Colaborador" }
    ]
  }

  haveArea(): boolean {
    let roles = this.demandaForm.controls['roles'].value;

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

  getEstadosDemanda() {
    this.listEstadosDemanda = [
      { id: 0, nombre: "Inactivo" },
      { id: 1, nombre: "Activo" }
    ]
  }

  goToBack() {
    if (this.idDemanda) {
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
    console.log(this.demandaForm.value);
    let request = this.demandaForm.value as IDemandaForm;

    if (this.validateForm(request) && this.demandaForm.valid) {

      if (this.idDemanda) {
        this.demandaService.update(request).subscribe({
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
        this.demandaService.create(request).subscribe({
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
