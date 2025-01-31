import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HistorialDemandaService } from '../../common/services/historial-demanda.service';
import { IHistorialDemandaList } from '../../common/models/historial-demanda-list.interface';

@Component({
  selector: 'app-historial-demanda-list-modal',
  templateUrl: './historial-demanda-list-modal.component.html',
  styleUrl: './historial-demanda-list-modal.component.scss'
})
export class HistorialDemandaListModalComponent {

  idDemanda: any
  datatable: IHistorialDemandaList[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogconfig: DynamicDialogConfig,
    private historialDemandaService: HistorialDemandaService
  ) {
    this.idDemanda = this.dialogconfig.data.idDemanda
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable(event?: any) {

    this.loading = true;
    this.datatable = []

    this.historialDemandaService.get(this.idDemanda, this.request).subscribe({
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

}
