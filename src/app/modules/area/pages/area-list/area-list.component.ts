import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IArea } from '../../common/models/area.interface';
import { AreaService } from '../../common/services/area.service';
import Swal from 'sweetalert2';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AreaFormModalComponent } from '../../common/components/area-form-modal/area-form-modal.component';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.scss'
})
export class AreaListComponent {

  datatable: IArea[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0
  ref: DynamicDialogRef | undefined;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private areaService: AreaService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {

  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable(event?: any) {

    this.loading = true;
    this.datatable = []

    this.areaService.get(this.request).subscribe({
      next: (response: any) => {
        console.log(response)
        this.datatable = response
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModalForm(id?: number) {
    let headerModal = id ? "Editar" : "Nuevo"

    this.ref = this.dialogService.open(AreaFormModalComponent, {
      data: {
        id: id
      },
      header: headerModal,
      width: '35rem'
    });

    this.ref.onClose.subscribe((response) => {
      if (response) {
        Swal.fire({
          title: response.message,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.getDatatable();
      }
    });

  }

  goToEdit(id: any) {
    this.router.navigate(['../edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  deleteById(id: any) {

    Swal.fire({
      title: "¿Deseas eliminar el Registro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.areaService.delete(id).subscribe({
          next: (response: any) => {
            console.log(response)
            if (response.status == "OK") {
              Swal.fire({
                title: response.message,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              })
              this.getDatatable();
            }
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo eliminar el Registro.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }
    });

  }
}
