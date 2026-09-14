import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { WorkflowService } from '../../common/services/workflow.service';
import { IWorkflow } from '../../common/models/workflow.interface';
import { IWorkflowForm } from '../../common/models/workflow-form.interface';
import { FormWorkflowService } from '../../common/services/form-workflow.service';
import { ITipologia } from '../../../tipologia/common/models/tipologia.interface';
import { ISubtipologia } from '../../../tipologia/common/models/subtipologia.interface';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';
import { ITipoDemanda } from '../../../../shared/models/tipo-demanda.interface';
import { DataService } from '../../../../shared/services/data.service';
import { FileService } from '../../../../shared/services/file.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrl: './workflow-form.component.scss'
})
export class WorkflowFormComponent implements OnInit {

  headerTitle: string = "Gestión de Flujo"
  readonly: boolean = false;
  saving: boolean = false;

  listTipoDemanda: ITipoDemanda[] = []
  listTipologia: ITipologia[] = []
  listSubtipologia: ISubtipologia[] = []

  workflowForm: FormGroup;
  idWorkflow?: number

  diagramUrl: string = '/assets/demo/base.bpmn';
  fileBPMN?: File

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
    private notification: NotificationService,
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

    this.formWorkflowService.setNombre('');

    this.workflowForm.get('nombre')?.valueChanges.subscribe((value: string) => {
      this.formWorkflowService.setNombre(value);
    });

  }

  ngOnInit(): void {
    this.readonly = this.activatedRoute.snapshot.data['readonly'] === true;

    if (this.readonly) {
      this.headerTitle = "Detalle de Flujo"
      this.workflowForm.disable();
    }

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
    this.workflowService.getById(this.idWorkflow!).subscribe({
      next: (response: IWorkflow) => {
        this.workflowForm.patchValue(response);
        this.diagramUrl = response.bpmn
        this.getSubtipologia(response.idTipologia)
      }
    });
  }

  getTipoDemanda() {
    this.dataService.getTipoDemanda().subscribe({
      next: (response: ITipoDemanda[]) => {
        this.listTipoDemanda = response;
      }
    });
  }

  getTipologia() {
    this.tipologiaService.getActives().subscribe({
      next: (response: ITipologia[]) => {
        this.listTipologia = response;
      }
    });
  }

  getSubtipologia(idTipologia: number) {
    this.subtipologiaService.getByIdTipologia(idTipologia).subscribe({
      next: (response: ISubtipologia[]) => {
        this.listSubtipologia = response;
      }
    });
  }

  goToBack() {
    this.router.navigate([this.idWorkflow ? '../../list' : '../list'], {
      relativeTo: this.activatedRoute
    });
  }

  onSubmit() {
    if (this.saving || this.readonly) {
      return;
    }

    const request: IWorkflowForm = this.workflowForm.getRawValue();

    if (!this.validateForm(request)) {
      return;
    }

    if (this.workflowForm.invalid) {
      this.notification.warning('Revise los datos del formulario.');
      return;
    }

    if (!this.fileBPMN && !request.bpmn) {
      this.notification.warning('Debe diseñar el diagrama BPMN del flujo.');
      return;
    }

    this.saving = true;
    this.loadingService.show();

    if (this.fileBPMN) {
      this.generateUrlBPMN()
    }
    else {
      this.onSave(request)
    }
  }

  onSave(request: IWorkflowForm) {
    const peticion = this.idWorkflow ? this.workflowService.update(request) : this.workflowService.create(request);

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

  validateForm(request: IWorkflowForm): boolean {
    let message: string = "";

    if (!request.nombre) {
      message = "El campo Nombre es requerido."
    } else if (!request.idTipoDemanda) {
      message = "El campo Tipo de demanda es requerido."
    } else if (!request.idTipologia) {
      message = "El campo Tipologia es requerido."
    } else if (!request.idSubtipologia) {
      message = "El campo Subtipologia es requerido."
    }

    if (message != "") {
      this.notification.warning(message);
    }

    return message == ""
  }

  onDiagramFileChange(file: File): void {
    this.fileBPMN = file;
  }

  generateUrlBPMN() {
    const controls = this.workflowForm.controls;
    const prefijo = `${controls['idTipoDemanda'].value}${controls['idTipologia'].value}${controls['idSubtipologia'].value}`;
    const file = new File([this.fileBPMN!], `${prefijo}_${this.fileBPMN!.name}`, { type: this.fileBPMN!.type });

    this.fileService.uploadFile(file, 'workflow-bpmn').subscribe({
      next: (response) => {
        controls['bpmn'].setValue(response.fileUrl)
        this.onSave(this.workflowForm.getRawValue())
      },
      error: () => this.onSaveFinished()
    });
  }
}
