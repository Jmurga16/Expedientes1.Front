import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { finalize } from 'rxjs';
import { IDemandaList } from '../../common/models/demanda.interface';
import { DemandaService } from '../../common/services/demanda.service';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { FileService } from '../../../../shared/services/file.service';
import { NotificationService } from '../../../../shared/services/notification.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Component({
  selector: 'app-demanda-list',
  templateUrl: './demanda-list.component.html',
  styleUrl: './demanda-list.component.scss'
})
export class DemandaListComponent {

  headerTitle: string = "Bandeja de Demandas"
  datatable: IDemandaList[] = []
  loading: boolean = true;
  request: IPaginatedFilter = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0
  exporting: boolean = false;
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private demandaService: DemandaService,
    private fileService: FileService,
    private notification: NotificationService,
  ) { }

  onGlobalFilter(table: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => table.filterGlobal(value, 'contains'), 400);
  }

  getDatatable(event?: TableLazyLoadEvent) {
    if (event) {
      this.request.pageSize = event.rows ?? this.request.pageSize
      this.request.pageIndex = ((event.first ?? 0) / this.request.pageSize) + 1
      this.request.search = typeof event.globalFilter === 'string' ? event.globalFilter : ''
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

  exportar() {
    if (this.exporting) {
      return;
    }

    this.exporting = true;

    this.demandaService.export(this.request.search)
      .pipe(finalize(() => this.exporting = false))
      .subscribe({
        next: (archivo: Blob) => this.fileService.downloadFile('expedientes.xlsx', archivo, EXCEL_TYPE)
      });
  }

  goToNew() {
    this.router.navigate(['../create'], {
      relativeTo: this.activatedRoute,
    });
  }

  goToEdit(id: number) {
    this.router.navigate(['../edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  goToDiagram(id: number) {
    this.router.navigate(['../diagram', id], {
      relativeTo: this.activatedRoute
    });
  }

  deleteById(id: number) {
    this.notification.confirm('¿Deseas eliminar el Registro?').then(confirmado => {
      if (!confirmado)
        return;

      this.demandaService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getDatatable();
        }
      });
    });
  }
}
