import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IArea } from '../../common/models/area.interface';
import { AreaService } from '../../common/services/area.service';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AreaFormModalComponent } from '../../common/components/area-form-modal/area-form-modal.component';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.scss'
})
export class AreaListComponent {

  datatable: IArea[] = []
  loading: boolean = true;
  totalRecords: number = 0
  pageSize: number = 10
  ref: DynamicDialogRef | undefined;

  constructor(
    private areaService: AreaService,
    private dialogService: DialogService,
    private notification: NotificationService,
  ) { }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable() {
    this.loading = true;
    this.datatable = []

    this.areaService.get().subscribe({
      next: (response: IArea[]) => {
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
    this.ref = this.dialogService.open(AreaFormModalComponent, {
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

      this.areaService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getDatatable();
        }
      });
    });
  }
}
