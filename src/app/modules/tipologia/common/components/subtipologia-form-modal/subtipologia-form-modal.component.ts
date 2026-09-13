import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipologiaService } from '../../services/tipologia.service';
import { SubtipologiaService } from '../../services/subtipologia.service';
import { ISubtipologiaForm } from '../../models/subtipologia-form.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subtipologia-form-modal',
  templateUrl: './subtipologia-form-modal.component.html',
  styleUrl: './subtipologia-form-modal.component.scss'
})
export class SubtipologiaFormModalComponent {

  id: any
  idTipologia: any
  form: FormGroup
  listEstado = [
    { value: 1, nombre: "Activo" },
    { value: 0, nombre: "Inactivo" }
  ]


  saving: boolean = false;

  get disabledForm(): boolean {
    return this.form.invalid || this.saving;
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogconfig: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private loadingService: LoadingService,

  ) {

    this.id = this.dialogconfig.data.id
    this.idTipologia = this.dialogconfig.data.idTipologia

    this.form = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required]],
      idTipologia: [this.idTipologia, [Validators.required]],
      estado: [1]
    });

  }

  ngOnInit(): void {
    if (this.id) {
      this.getData();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getData() {

    this.subtipologiaService.getById(this.id).subscribe({
      next: (response) => {
        this.form.patchValue(response);
      }
    });
  }

  create() {
    if (this.saving) {
      return;
    }

    let request = this.form.value as ISubtipologiaForm;

    if (request) {
      this.saving = true;
      this.loadingService.show();
      this.subtipologiaService.create(request)
        .pipe(finalize(() => this.onSaveFinished()))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: error.error?.message ?? 'No se pudo guardar el registro.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
    }
  }

  update() {
    if (this.saving) {
      return;
    }

    let request = this.form.value as ISubtipologiaForm;

    if (request) {
      this.saving = true;
      this.loadingService.show();
      this.subtipologiaService.update(request)
        .pipe(finalize(() => this.onSaveFinished()))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: error.error?.message ?? 'No se pudo guardar el registro.',
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
}
