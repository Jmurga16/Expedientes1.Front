import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { AreaService } from '../../services/area.service';
import { IArea } from '../../models/area.interface';
import { IAreaForm } from '../../models/area-form.interface';
import { IOpcion } from '../../../../../shared/models/opcion.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-area-form-modal',
  templateUrl: './area-form-modal.component.html',
  styleUrl: './area-form-modal.component.scss'
})
export class AreaFormModalComponent implements OnInit {

  id?: number
  form: FormGroup
  listEstado: IOpcion[] = [
    { id: 1, nombre: "Activo" },
    { id: 0, nombre: "Inactivo" }
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
    this.areaService.getById(this.id!).subscribe({
      next: (response: IArea) => {
        this.form.patchValue(response);
      }
    });
  }

  create() {
    this.guardar(false);
  }

  update() {
    this.guardar(true);
  }

  private guardar(esEdicion: boolean) {
    if (this.saving) {
      return;
    }

    const request: IAreaForm = this.form.value;

    this.saving = true;
    this.loadingService.show();

    const peticion = esEdicion ? this.areaService.update(request) : this.areaService.create(request);

    peticion.pipe(finalize(() => this.onSaveFinished())).subscribe({
      next: (response) => this.dialogRef.close(response)
    });
  }

  private onSaveFinished() {
    this.saving = false;
    this.loadingService.hide();
  }
}
