import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from '../../common/services/workflow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkflowForm } from '../../common/models/workflow-form.interface';
import Swal from 'sweetalert2';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../../shared/directives/password-validator.directive';
import { AreaService } from '../../../area/common/services/area.service';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrl: './workflow-form.component.scss'
})
export class WorkflowFormComponent {

  headerTitle: string = "Gestión de Flujo"
  readonly: boolean = false;
  isEdit: boolean = false;
  loading: boolean = false;

  listRoles: any[] = [];
  listEstadosWorkflow: any[] = []
  listArea: any = []

  listTipoDemanda: any[] = []
  listTipologia: any[] = []
  listSubtipologia: any[] = []

  workflowForm: FormGroup;
  idWorkflow: any


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private areaService: AreaService,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private router: Router

  ) {

    this.workflowForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      address: [null],

      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, upperCaseValidator(), lowerCaseValidator(), specialCharacterValidator()]],
      workflowname: [{ disabled: true, value: null }, [Validators.required, Validators.email]],
      status: [1],
      idArea: [null],
      idTipologia: [null],
      idSubtipologia: [null],
      roles: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idWorkflow = params['id']; // Obtén el ID de la ruta
      console.log('Workflow ID:', this.idWorkflow);
      if (this.idWorkflow) {
        this.getWorkflow();
      }
    });

    this.getRoles()
    this.getEstadosWorkflow()
    this.getAreas()
    this.getTipologia();
  }

  getWorkflow() {
    this.workflowService.getById(this.idWorkflow).subscribe({
      next: (response: any) => {
        console.log(response)
        this.workflowForm.patchValue(response);
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
      { id: "ROLE_USER", nombre: "Workflow" },
      { id: "ROLE_AREA", nombre: "Referente Area" },
      { id: "ROLE_COLAB", nombre: "Colaborador" }
    ]
  }

  haveArea(): boolean {
    let roles = this.workflowForm.controls['roles'].value;

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

  getEstadosWorkflow() {
    this.listEstadosWorkflow = [
      { id: 0, nombre: "Inactivo" },
      { id: 1, nombre: "Activo" }
    ]
  }

  goToBack() {
    if (this.idWorkflow) {
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
    console.log(this.workflowForm.value);
    let request = this.workflowForm.value as IWorkflowForm;

    if (this.validateForm(request) && this.workflowForm.valid) {

      if (this.idWorkflow) {
        this.workflowService.update(request).subscribe({
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
        this.workflowService.create(request).subscribe({
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
