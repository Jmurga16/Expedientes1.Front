import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISubtipologia } from '../../common/models/subtipologia.interface';
import { SubtipologiaService } from '../../common/services/subtipologia.service';
import { SubtipologiaFormModalComponent } from '../../common/components/subtipologia-form-modal/subtipologia-form-modal.component';
import { TipologiaService } from '../../common/services/tipologia.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-subtipologia-list',
  templateUrl: './subtipologia-list.component.html',
  styleUrl: './subtipologia-list.component.scss'
})
export class SubtipologiaListComponent {

  datatable: ISubtipologia[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0
  ref: DynamicDialogRef | undefined;
  listTipologia = []

  idTipologia = new FormControl()

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.getTipologias()
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getTipologias() {
    this.tipologiaService.getActives().subscribe({
      next: (response: any) => {
        console.log(response)
        this.listTipologia = response
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getDatatable(event?: any) {

    this.loading = true;
    this.datatable = []

    this.subtipologiaService.getByIdTipologia(this.idTipologia.value).subscribe({
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

    this.ref = this.dialogService.open(SubtipologiaFormModalComponent, {
      data: {
        idTipologia: this.idTipologia.value,
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

  deleteById(id: any) {

    Swal.fire({
      title: "¿Deseas eliminar el Registro?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.subtipologiaService.delete(id).subscribe({
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
