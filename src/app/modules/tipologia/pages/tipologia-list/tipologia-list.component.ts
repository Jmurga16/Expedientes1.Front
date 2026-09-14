import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ITipologia } from '../../common/models/tipologia.interface';
import { TipologiaService } from '../../common/services/tipologia.service';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { NotificationService } from '../../../../shared/services/notification.service';
import { TipologiaFormModalComponent } from '../../common/components/tipologia-form-modal/tipologia-form-modal.component';

@Component({
  selector: 'app-tipologia-list',
  templateUrl: './tipologia-list.component.html',
  styleUrl: './tipologia-list.component.scss'
})
export class TipologiaListComponent {

  datatable: ITipologia[] = []
  loading: boolean = true;
  totalRecords: number = 0
  pageSize: number = 10
  ref: DynamicDialogRef | undefined;

  constructor(
    private tipologiaService: TipologiaService,
    private dialogService: DialogService,
    private notification: NotificationService,
  ) { }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable() {
    this.loading = true;
    this.datatable = []

    this.tipologiaService.get().subscribe({
      next: (response: ITipologia[]) => {
        this.datatable = response
        this.totalRecords = response.length
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModalForm(id?: number) {
    this.ref = this.dialogService.open(TipologiaFormModalComponent, {
      data: { id },
      header: id ? 'Editar' : 'Nuevo',
      width: '35rem'
    });

    this.ref.onClose.subscribe((response?: IMessage) => {
      if (response) {
        this.notification.success(response.message);
        this.getDatatable();
      }
    });
  }

  deleteById(id: number) {
    this.notification.confirm('¿Deseas eliminar el Registro?').then(confirmado => {
      if (!confirmado)
        return;

      this.tipologiaService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getDatatable();
        }
      });
    });
  }
}
