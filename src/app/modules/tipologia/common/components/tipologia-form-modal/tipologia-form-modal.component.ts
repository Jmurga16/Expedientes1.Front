import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { TipologiaService } from '../../services/tipologia.service';
import { ITipologia } from '../../models/tipologia.interface';
import { ITipologiaForm } from '../../models/tipologia-form.interface';
import { IOpcion } from '../../../../../shared/models/opcion.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-tipologia-form-modal',
  templateUrl: './tipologia-form-modal.component.html',
  styleUrl: './tipologia-form-modal.component.scss'
})
export class TipologiaFormModalComponent implements OnInit {

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
    private tipologiaService: TipologiaService,
    private loadingService: LoadingService,
  ) {

    this.id = this.dialogconfig.data.id

    this.form = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
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
    this.tipologiaService.getById(this.id!).subscribe({
      next: (response: ITipologia) => {
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

    const request: ITipologiaForm = this.form.value;

    this.saving = true;
    this.loadingService.show();

    const peticion = esEdicion ? this.tipologiaService.update(request) : this.tipologiaService.create(request);

    peticion.pipe(finalize(() => this.onSaveFinished())).subscribe({
      next: (response) => this.dialogRef.close(response)
    });
  }

  private onSaveFinished() {
    this.saving = false;
    this.loadingService.hide();
  }
}
