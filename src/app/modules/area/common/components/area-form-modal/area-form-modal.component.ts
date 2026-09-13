import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AreaService } from '../../services/area.service';
import { IAreaForm } from '../../models/area-form.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-area-form-modal',
  templateUrl: './area-form-modal.component.html',
  styleUrl: './area-form-modal.component.scss'
})
export class AreaFormModalComponent {

  id: any
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
    private areaService: AreaService,
    private loadingService: LoadingService,
  ) {

    this.id = this.dialogconfig.data.id

    this.form = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required]],
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
    this.areaService.getById(this.id).subscribe({
      next: (response) => {
        this.form.patchValue(response);
      }
    });
  }

  create() {
    if (this.saving) {
      return;
    }

    let request = this.form.value as IAreaForm;

    if (request) {
      this.saving = true;
      this.loadingService.show();
      this.areaService.create(request)
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

    let request = this.form.value as IAreaForm;

    if (request) {
      this.saving = true;
      this.loadingService.show();
      this.areaService.update(request)
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
