import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ISubtipologia } from '../../common/models/subtipologia.interface';
import { ITipologia } from '../../common/models/tipologia.interface';
import { SubtipologiaService } from '../../common/services/subtipologia.service';
import { TipologiaService } from '../../common/services/tipologia.service';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SubtipologiaFormModalComponent } from '../../common/components/subtipologia-form-modal/subtipologia-form-modal.component';

@Component({
  selector: 'app-subtipologia-list',
  templateUrl: './subtipologia-list.component.html',
  styleUrl: './subtipologia-list.component.scss'
})
export class SubtipologiaListComponent implements OnInit {

  datatable: ISubtipologia[] = []
  loading: boolean = true;
  pageSize: number = 10
  ref: DynamicDialogRef | undefined;
  listTipologia: ITipologia[] = []

  idTipologia = new FormControl<number | null>(null)

  constructor(
    private tipologiaService: TipologiaService,
    private subtipologiaService: SubtipologiaService,
    private dialogService: DialogService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    this.getTipologias()
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getTipologias() {
    this.tipologiaService.getActives().subscribe({
      next: (response: ITipologia[]) => {
        this.listTipologia = response
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getDatatable() {
    const idTipologia = this.idTipologia.value;
    this.loading = idTipologia != null;
    this.datatable = []

    if (idTipologia == null)
      return;

    this.subtipologiaService.getByIdTipologia(idTipologia).subscribe({
      next: (response: ISubtipologia[]) => {
        this.datatable = response
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModalForm(id?: number) {
    this.ref = this.dialogService.open(SubtipologiaFormModalComponent, {
      data: { idTipologia: this.idTipologia.value, id },
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

      this.subtipologiaService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getDatatable();
        }
      });
    });
  }
}
