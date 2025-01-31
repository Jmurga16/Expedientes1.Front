import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandaService } from '../../common/services/demanda.service';
import { FileService } from '../../../../shared/services/file.service';
import { UsuarioService } from '../../../user/common/services/usuario.service';
import { IDemandaForm } from '../../common/models/demanda-form.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../../../shared/services/data.service';
import { TokenService } from '../../../../auth/services/token.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HistorialDemandaListModalComponent } from '../historial-demanda-list-modal/historial-demanda-list-modal.component';
import { IHistorialDemandaForm } from '../../common/models/historial-demanda-form.interface';
import { HistorialDemandaService } from '../../common/services/historial-demanda.service';

@Component({
  selector: 'app-demanda-workflow',
  templateUrl: './demanda-workflow.component.html',
  styleUrl: './demanda-workflow.component.scss'
})
export class DemandaWorkflowComponent {

  loading: boolean = false
  demandaForm: FormGroup;
  idDemanda: any
  diagramUrl: string = ""
  listTask: any[] = []
  listEstadosDemanda: any[] = []
  currentRol: string = ""
  ref: DynamicDialogRef | undefined;

  idUsuarioSesion: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private fileService: FileService,
    private usuarioService: UsuarioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private tokenService: TokenService,
    private dialogService: DialogService,
    private historialDemandaService: HistorialDemandaService,
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
      prioridad: [null],
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
      console.log('Demanda ID:', this.idDemanda);
      if (this.idDemanda) {
        this.getDemanda();
      }
    });

    this.currentRol = this.tokenService.getCurrentRol()
    console.log("rol", this.currentRol)

    if (this.currentRol === 'usuario') {
      this.demandaForm.get('paso')?.disable();
      this.demandaForm.get('estado')?.disable();
    }

    this.getUser()
    this.getEstadosDemanda()
    console.log("listTask")
    console.log(this.listTask)
  }

  getDemanda() {
    this.demandaService.getById(this.idDemanda).subscribe({
      next: (response: any) => {
        console.log(response)
        this.demandaForm.patchValue(response);
        this.diagramUrl = response.urlBpmn
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        //this.getSubtipologia(this.demandaForm.controls["idTipologia"].value)
      }
    });
  }

  getEstadosDemanda() {
    this.dataService.getEstadosStep().subscribe({
      next: (response: any) => {
        this.listEstadosDemanda = response;
      }
    });
  }

  goToBack() {
    this.router.navigate(['../../list'], {
      relativeTo: this.activatedRoute
    });
  }

  validateForm(request: any): boolean {

    let message: string = "";

    if (request.paso == null || request.paso == "") {
      message = "El campo Paso es requerido."
    } else if (request.estado == null || request.estado == "") {
      message = "El campo Estado es requerido."
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

  onSubmit() {
    console.log(this.demandaForm.value);
    let request = this.demandaForm.value as IDemandaForm;

    if (this.validateForm(request) && this.demandaForm.valid) {

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
        },
        complete: () => {
          this.registerOnHistorial()
        }
      });

    }
  }

  listPasos(event: any) {
    console.log("demanda-workflow")
    console.log(event)

    if (!event.includes("Finalizado")) {
      event.push("Finalizado")
    }

    this.listTask = this.mapListToDropdown(event)
  }

  mapListToDropdown(list: string[]): any[] {
    return list.map(item => ({ id: item, nombre: item }));
  }

  getUser() {
    let email = this.tokenService.getEmail()

    this.usuarioService.getByEmail(email).subscribe({
      next: (response: any) => {

        this.idUsuarioSesion = response.id

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  registerOnHistorial() {

    let request: IHistorialDemandaForm = {
      idUsuario: this.idUsuarioSesion,
      idDemanda: this.demandaForm.controls["id"].value,
      paso: this.demandaForm.controls["idTipologia"].value,
      estado: this.demandaForm.controls["estado"].value,
      observaciones: this.demandaForm.controls["observaciones"].value,
    }

    this.historialDemandaService.create(request).subscribe({
      next: (response: any) => {
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

  openModalHistorial() {
    let headerModal = "Historial de Demanda"

    this.ref = this.dialogService.open(HistorialDemandaListModalComponent, {
      data: {
        idDemanda: this.idDemanda,
      },
      header: headerModal,
      width: '55rem'
    });
  }



}
