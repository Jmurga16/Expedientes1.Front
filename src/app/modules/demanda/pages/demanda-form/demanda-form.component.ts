import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandaService } from '../../common/services/demanda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDemandaForm } from '../../common/models/demanda-form.interface';
import Swal from 'sweetalert2';
import { AreaService } from '../../../area/common/services/area.service';
import { TipologiaService } from '../../../tipologia/common/services/tipologia.service';
import { SubtipologiaService } from '../../../tipologia/common/services/subtipologia.service';
import { DataService } from '../../../../shared/services/data.service';
import { UsuarioService } from '../../../user/common/services/usuario.service';
import { TokenService } from '../../../../auth/services/token.service';
import { FileService } from '../../../../shared/services/file.service';
import { HistorialDemandaService } from '../../common/services/historial-demanda.service';
import { IHistorialDemandaForm } from '../../common/models/historial-demanda-form.interface';

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
  userForm: FormGroup;
  historialDemandaForm: FormGroup;

  idDemanda: any

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private historialDemandaService: HistorialDemandaService,
    private areaService: AreaService,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dataService: DataService,
    private fileService: FileService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private router: Router

  ) {

    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null],
      lastname: [null],
      dni: [null],
      address: [null],
      email: [null],
    });

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
      paso: ['Inicio'],
      urlBpmn: ['/assets/demo/base.bpmn'],

      estado: [0]
    });

    this.historialDemandaForm = this.formBuilder.group({
      id: [null],
      idUsuario: [null],
      idDemanda: [null],
      paso: ['Inicio'],
      observaciones: [null],
      fecha: [null],
      estado: [0]
    });

  }

  ngOnInit(): void {

    this.getUser();
    this.getEstadosDemanda()
    this.getAreas()
    this.getTipologia();
    this.getTipoDemanda();

    this.activatedRoute.params.subscribe(params => {
      this.idDemanda = params['id'];
      console.log('Demanda ID:', this.idDemanda);
      if (this.idDemanda) {
        this.getDemanda();
      }
    });

  }

  getUser() {
    let email = this.tokenService.getEmail()

    this.usuarioService.getByEmail(email).subscribe({
      next: (response: any) => {
        console.log(response)
        this.userForm.patchValue(response);

        this.demandaForm.controls["idUsuario"].setValue(response.id)
        this.historialDemandaForm.controls["idUsuario"].setValue(response.id)

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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
      },
      complete: () => {
        this.getSubtipologia(this.demandaForm.controls["idTipologia"].value)
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

  async getSubtipologia(idTipologia: number) {

    this.setDescripcion(idTipologia)

    this.subtipologiaService.getByIdTipologia(idTipologia).subscribe({
      next: (response: any) => {
        this.listSubtipologia = response;
      }
    });
  }

  setDescripcion(idTipologia: number) {
    this.listTipologia.forEach(element => {
      if (element.id == idTipologia) {
        this.demandaForm.controls["descripcion"].setValue(element.descripcion)
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

            this.demandaForm.controls["id"].setValue(response.id)
            this.historialDemandaForm.controls["idDemanda"].setValue(response.id)

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
  }

  validateForm(request: any): boolean {

    let message: string = "";

    if (request.idTipoDemanda == null || request.idTipoDemanda == "") {
      message = "El campo Tipo de Demanda es requerido."
    } else if (request.idTipologia == null || request.idTipologia == "") {
      message = "El campo Tipologia es requerido."
    } else if (request.idSubtipologia == null || request.idSubtipologia == "") {
      message = "El campo Subtipologia es requerido."
    } else if (request.domicilio == null || request.domicilio == "") {
      message = "El campo Domicilio es requerido."
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

  onUploadImage(event: any) {
    const file = event.files[0];
    const container = "demanda-imagen"

    if (file) {
      this.fileService.uploadFileUnique(file, container).subscribe({
        next: (response: any) => {
          console.log('Archivo subido:', response);
          const fileUrl = response.fileUrl;
          this.demandaForm.patchValue({ rutaImagen: fileUrl });
        },
        error: (err) => console.error('Error al subir archivo:', err),
      });
    }
  }

  registerOnHistorial() {

    let request = this.historialDemandaForm.value as IHistorialDemandaForm;

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

}
