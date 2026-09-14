import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { SubtipologiaService } from '../../services/subtipologia.service';
import { ISubtipologia } from '../../models/subtipologia.interface';
import { ISubtipologiaForm } from '../../models/subtipologia-form.interface';
import { IOpcion } from '../../../../../shared/models/opcion.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-subtipologia-form-modal',
  templateUrl: './subtipologia-form-modal.component.html',
  styleUrl: './subtipologia-form-modal.component.scss'
})
export class SubtipologiaFormModalComponent implements OnInit {

  id?: number
  idTipologia: number
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
    this.subtipologiaService.getById(this.id!).subscribe({
      next: (response: ISubtipologia) => {
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

    const request: ISubtipologiaForm = this.form.value;

    this.saving = true;
    this.loadingService.show();

    const peticion = esEdicion ? this.subtipologiaService.update(request) : this.subtipologiaService.create(request);

    peticion.pipe(finalize(() => this.onSaveFinished())).subscribe({
      next: (response) => this.dialogRef.close(response)
    });
  }

  private onSaveFinished() {
    this.saving = false;
    this.loadingService.hide();
  }
}
