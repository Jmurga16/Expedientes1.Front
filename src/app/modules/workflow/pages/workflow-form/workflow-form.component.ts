import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from '../../common/services/workflow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkflowForm } from '../../common/models/workflow-form.interface';
import Swal from 'sweetalert2';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';
import { DataService } from '../../../../shared/services/data.service';
import { FileService } from '../../../../shared/services/file.service';
import { FormWorkflowService } from '../../common/services/form-workflow.service';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrl: './workflow-form.component.scss'
})
export class WorkflowFormComponent implements OnInit {

  headerTitle: string = "Gestión de Flujo"
  readonly: boolean = false;
  saving: boolean = false;

  listTipoDemanda: any[] = []
  listTipologia: any[] = []
  listSubtipologia: any[] = []

  workflowForm: FormGroup;
  idWorkflow: any

  diagramUrl: string = '/assets/demo/base.bpmn';
  fileBPMN: any

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dataService: DataService,
    private fileService: FileService,
    private formWorkflowService: FormWorkflowService,
    private loadingService: LoadingService,
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

    this.workflowForm.get('nombre')?.valueChanges.subscribe(value => {
      this.formWorkflowService.setNombre(value);
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idWorkflow = params['id'];
      if (this.idWorkflow) {
        this.getWorkflow();
      }
      else {
        this.preloadFromQueryParams();
      }
    });

    this.getTipologia();
    this.getTipoDemanda();
  }

  private preloadFromQueryParams() {
    const query = this.activatedRoute.snapshot.queryParamMap;
    const idTipoDemanda = Number(query.get('idTipoDemanda'));
    const idTipologia = Number(query.get('idTipologia'));
    const idSubtipologia = Number(query.get('idSubtipologia'));

    if (!idTipoDemanda || !idTipologia || !idSubtipologia)
      return;

    this.workflowForm.patchValue({ idTipoDemanda, idTipologia, idSubtipologia });
    this.getSubtipologia(idTipologia);
  }

  getWorkflow() {
    this.workflowService.getById(this.idWorkflow).subscribe({
      next: (response: any) => {
        this.workflowForm.patchValue(response);
        this.diagramUrl = response.bpmn
        this.getSubtipologia(response.idTipologia)
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
    if (this.saving) {
      return;
    }

    let request = this.workflowForm.value as IWorkflowForm;

    if (!this.validateForm(request)) {
      return;
    }

    if (this.workflowForm.invalid) {
      this.showWarning('Revise los datos del formulario.');
      return;
    }

    if (!this.fileBPMN && !this.workflowForm.controls["bpmn"].value) {
      this.showWarning('Debe diseñar el diagrama BPMN del flujo.');
      return;
    }

    this.saving = true;
    this.loadingService.show();

    if (this.fileBPMN) {
      this.generateUrlBPMN()
    }
    else {
      this.onSave(this.workflowForm.value)
    }
  }

  showWarning(message: string) {
    Swal.fire({
      title: 'Advertencia!',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    })
  }

  onSave(request: any) {

    if (this.idWorkflow) {
      this.workflowService.update(request)
        .pipe(finalize(() => this.onSaveFinished()))
        .subscribe({
          next: (response: any) => {
            Swal.fire({
              title: 'Éxito.',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
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
      this.workflowService.create(request)
        .pipe(finalize(() => this.onSaveFinished()))
        .subscribe({
          next: (response: any) => {
            Swal.fire({
              title: 'Éxito.',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            })
            this.goToBack();
          },
          error: (error: any) => {
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

  private onSaveFinished() {
    this.saving = false;
    this.loadingService.hide();
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

  onDiagramFileChange(file: File): void {
    this.fileBPMN = file;
  }

  generateUrlBPMN() {
    let nameFile: string = ""
    const container: string = "workflow-bpmn"

    nameFile = nameFile + this.workflowForm.controls["idTipoDemanda"].value.toString();
    nameFile = nameFile + this.workflowForm.controls["idTipologia"].value.toString();
    nameFile = nameFile + this.workflowForm.controls["idSubtipologia"].value.toString();

    nameFile = nameFile + "_" + this.fileBPMN.name

    const file = new File([this.fileBPMN], nameFile, { type: this.fileBPMN.type });

    this.fileService.uploadFile(file, container).subscribe({
      next: (response: any) => {
        this.workflowForm.controls["bpmn"].setValue(response.fileUrl)
        this.onSave(this.workflowForm.value)
      },
      error: (err) => {
        this.onSaveFinished();
        Swal.fire({
          title: 'Error!',
          text: err.error?.message ?? 'No se pudo subir el diagrama BPMN.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });
  }
}
