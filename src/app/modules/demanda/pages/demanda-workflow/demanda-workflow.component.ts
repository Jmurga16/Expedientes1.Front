import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { DemandaService } from '../../common/services/demanda.service';
import { IDemanda } from '../../common/models/demanda.interface';
import { IDemandaForm } from '../../common/models/demanda-form.interface';
import { HistorialDemandaListModalComponent } from '../historial-demanda-list-modal/historial-demanda-list-modal.component';
import { IOpcion } from '../../../../shared/models/opcion.interface';
import { DataService } from '../../../../shared/services/data.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { TokenService } from '../../../../auth/services/token.service';

@Component({
  selector: 'app-demanda-workflow',
  templateUrl: './demanda-workflow.component.html',
  styleUrl: './demanda-workflow.component.scss'
})
export class DemandaWorkflowComponent implements OnInit {

  loading: boolean = false
  saving: boolean = false
  demandaForm: FormGroup;
  idDemanda?: number
  diagramUrl: string = ""
  listTask: IOpcion<string>[] = []
  listEstadosDemanda: IOpcion[] = []
  currentRol: string = ""
  ref: DynamicDialogRef | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private tokenService: TokenService,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private notification: NotificationService,
  ) {

    this.demandaForm = this.formBuilder.group({
      id: [null],
      caratula: [null],
      idUsuario: [null],

      idTipoDemanda: [null],
      idTipologia: [null],
      idSubtipologia: [null],
      descripcion: [null],

      domicilio: [null],
      rutaImagen: [null],

      informacionAdicional: [null],
      paso: [null],
      urlBpmn: ['/assets/demo/base.bpmn'],
      observaciones: [null],
      estado: [1]
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idDemanda = params['id'];
      if (this.idDemanda) {
        this.getDemanda();
      }
    });

    this.currentRol = this.tokenService.getCurrentRol()

    if (this.currentRol === 'usuario') {
      this.demandaForm.get('paso')?.disable();
      this.demandaForm.get('estado')?.disable();
    }

    this.getEstadosDemanda()
  }

  getDemanda() {
    this.demandaService.getById(this.idDemanda!).subscribe({
      next: (response: IDemanda) => {
        this.demandaForm.patchValue(response);
        this.diagramUrl = response.urlBpmn
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getEstadosDemanda() {
    this.dataService.getEstadosStep().subscribe({
      next: (response: IOpcion[]) => {
        this.listEstadosDemanda = response;
      }
    });
  }

  goToBack() {
    this.router.navigate(['../../list'], {
      relativeTo: this.activatedRoute
    });
  }

  validateForm(request: IDemandaForm): boolean {
    let message: string = "";

    if (!request.paso) {
      message = "El campo Paso es requerido."
    } else if (request.estado == null) {
      message = "El campo Estado es requerido."
    }

    if (message != "") {
      this.notification.warning(message);
    }

    return message == ""
  }

  onSubmit() {
    if (this.saving) {
      return;
    }

    const request: IDemandaForm = this.demandaForm.getRawValue();

    if (!this.validateForm(request)) {
      return;
    }

    if (this.demandaForm.invalid) {
      this.notification.warning('Revise los datos del formulario.');
      return;
    }

    this.saving = true;
    this.loadingService.show();

    this.demandaService.update(request)
      .pipe(finalize(() => {
        this.saving = false;
        this.loadingService.hide();
      }))
      .subscribe({
        next: (response) => {
          this.notification.success(response.message);
          this.goToBack();
        }
      });
  }

  listPasos(pasos: string[]) {
    if (!pasos.includes("Finalizado")) {
      pasos.push("Finalizado")
    }

    this.listTask = pasos.map(paso => ({ id: paso, nombre: paso }));
  }

  openModalHistorial() {
    this.ref = this.dialogService.open(HistorialDemandaListModalComponent, {
      data: {
        idDemanda: this.idDemanda,
      },
      header: "Historial de Demanda",
      width: '55rem'
    });
  }
}
