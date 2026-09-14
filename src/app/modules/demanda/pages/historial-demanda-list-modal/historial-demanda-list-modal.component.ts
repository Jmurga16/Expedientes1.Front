import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { HistorialDemandaService } from '../../common/services/historial-demanda.service';
import { IHistorialDemandaList } from '../../common/models/historial-demanda-list.interface';

@Component({
  selector: 'app-historial-demanda-list-modal',
  templateUrl: './historial-demanda-list-modal.component.html',
  styleUrl: './historial-demanda-list-modal.component.scss'
})
export class HistorialDemandaListModalComponent {

  idDemanda: number
  datatable: IHistorialDemandaList[] = []
  loading: boolean = true;
  totalRecords: number = 0
  pageSize: number = 10

  constructor(
    public dialogconfig: DynamicDialogConfig,
    private historialDemandaService: HistorialDemandaService
  ) {
    this.idDemanda = this.dialogconfig.data.idDemanda
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable() {
    this.loading = true;
    this.datatable = []

    this.historialDemandaService.get(this.idDemanda).subscribe({
      next: (response: IHistorialDemandaList[]) => {
        this.datatable = response
        this.totalRecords = response.length
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
