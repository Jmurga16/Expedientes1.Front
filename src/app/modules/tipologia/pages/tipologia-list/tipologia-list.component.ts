import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITipologia } from '../../common/models/tipologia.interface';
import { TipologiaService } from '../../common/services/tipologia.service';
import Swal from 'sweetalert2';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipologiaFormModalComponent } from '../../common/components/tipologia-form-modal/tipologia-form-modal.component';

@Component({
  selector: 'app-tipologia-list',
  templateUrl: './tipologia-list.component.html',
  styleUrl: './tipologia-list.component.scss'
})
export class TipologiaListComponent {

  datatable: ITipologia[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0
  ref: DynamicDialogRef | undefined;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tipologiaService: TipologiaService,
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

    this.tipologiaService.get(this.request).subscribe({
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

    this.ref = this.dialogService.open(TipologiaFormModalComponent, {
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
        this.tipologiaService.delete(id).subscribe({
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
