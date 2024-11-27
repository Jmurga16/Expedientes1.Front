import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipologiaService } from '../../services/tipologia.service';

@Component({
  selector: 'app-tipologia-form-modal',
  templateUrl: './tipologia-form-modal.component.html',
  styleUrl: './tipologia-form-modal.component.scss'
})
export class TipologiaFormModalComponent {

  id: any
  form: FormGroup
  listEstado = [
    { value: 1, nombre: "Activo" },
    { value: 0, nombre: "Inactivo" }
  ]


  get disabledForm(): boolean {
    return this.form.invalid;
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogconfig: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private tipologiaService: TipologiaService
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
      this.getData(this.id);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getData(id: any) {

    this.tipologiaService.getById(this.id).subscribe({
      next: (response) => {
        this.form.patchValue(response);
      }
    });


  }

  create() {
    let request = this.form.value as any;

    if (request) {
      this.tipologiaService.create(request).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        }
      });
    }
  }

  update() {
    let request = this.form.value as any;

    if (request) {
      this.tipologiaService.update(request).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        }
      });
    }
  }
}
