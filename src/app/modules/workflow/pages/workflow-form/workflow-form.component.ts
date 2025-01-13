import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from '../../common/services/workflow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkflowForm } from '../../common/models/workflow-form.interface';
import Swal from 'sweetalert2';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../../shared/directives/password-validator.directive';
import { AreaService } from '../../../area/common/services/area.service';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';
import { DataService } from '../../../../shared/services/data.service';
import { FileService } from '../../../../shared/services/file.service';

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

  //@Input() urlBPMN?: string;
  diagramUrl: string = '/assets/demo/base.bpmn';
  fileBPMN: any

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private areaService: AreaService,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dataService: DataService,
    private fileService: FileService,
    private router: Router

  ) {

    this.workflowForm = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required]],
      idTipoDemanda: [null],
      idTipologia: [null],
      idSubtipologia: [null],
      descripcion: [null],
      bpmn: [null],
      estado: [1]
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
    this.getTipoDemanda();
  }

  getWorkflow() {
    this.workflowService.getById(this.idWorkflow).subscribe({
      next: (response: any) => {
        console.log(response)
        this.workflowForm.patchValue(response);
        this.diagramUrl = response.bpmn
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.getSubtipologia(this.workflowForm.controls["idTipologia"].value)
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

      this.generateUrlBPMN()

    }
  }

  onSave(request: any) {
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

  validateForm(request: any): boolean {

    let message: string = "";

    if (request.nombre == null || request.nombre == "") {
      message = "El campo Nombre es requerido."
    } else if (request.idTipoDemanda == null || request.idTipoDemanda == "") {
      message = "El campo Tipo de demanda es requerido."
    } else if (request.idTipologia == null || request.idTipologia == "") {
      message = "El campo Tipologia es requerido."
    } else if (request.idSubtipologia == null || request.idSubtipologia == "") {
      message = "El campo Subtipologia es requerido."
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

  onDiagramUrlChange(newUrl: string): void {
    this.diagramUrl = newUrl;
    console.log('URL del diagrama actualizada:', this.diagramUrl);
  }

  onDiagramFileChange(file: File): void {
    this.fileBPMN = file;
    console.log('Archivo del diagrama actualizada:', this.fileBPMN);
  }

  generateUrlBPMN() {
    const container = "workflow-bpmn"

    if (this.fileBPMN) {
      this.fileService.uploadFileUnique(this.fileBPMN, container).subscribe({
        next: (response: any) => {
          console.log('Archivo subido:', response);
          this.workflowForm.controls["bpmn"].setValue(response.fileUrl)
        },
        error: (err) => console.error('Error al subir archivo:', err),
        complete: () => {

          this.onSave(this.workflowForm.value)
        }
      });
    }
  }
}
