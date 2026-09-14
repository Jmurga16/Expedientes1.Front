import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDemanda } from '../../common/models/demanda.interface';
import { DemandaService } from '../../common/services/demanda.service';
import Swal from 'sweetalert2';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-demanda-list',
  templateUrl: './demanda-list.component.html',
  styleUrl: './demanda-list.component.scss'
})
export class DemandaListComponent {

  headerTitle: string = "Bandeja de Demandas"
  datatable: IDemanda[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0
  ref: DynamicDialogRef | undefined;
  private searchTimer?: ReturnType<typeof setTimeout>;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {

  }

  onGlobalFilter(table: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => table.filterGlobal(value, 'contains'), 400);
  }

  getDatatable(event?: any) {

    if (event) {
      this.request.pageSize = event.rows
      this.request.pageIndex = (event.first / event.rows) + 1
      this.request.search = event.globalFilter
    }

    this.loading = true;
    this.datatable = []

    this.demandaService.get(this.request).subscribe({
      next: (response) => {
        this.datatable = response.items
        this.totalRecords = response.totalRecords
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToNew() {
    this.router.navigate(['../create'], {
      relativeTo: this.activatedRoute,
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
        this.demandaService.delete(id).subscribe({
          next: (response: any) => {
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

  goToDiagram(id: any) {
    this.router.navigate(['../diagram', id], {
      relativeTo: this.activatedRoute
    });
  }
  
}
