import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AreaService } from '../../services/area.service';

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


  get disabledForm(): boolean {
    return this.form.invalid;
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogconfig: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private areaService: AreaService
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
      this.getData(this.id);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getData(id: any) {
    this.areaService.getById(this.id).subscribe({
      next: (response) => {
        this.form.patchValue(response);
      }
    });
  }

  create() {
    let request = this.form.value as any;

    if (request) {
      this.areaService.create(request).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        }
      });
    }
  }

  update() {
    let request = this.form.value as any;

    if (request) {
      this.areaService.update(request).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        }
      });
    }
  }
}
