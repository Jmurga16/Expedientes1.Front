import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { IWorkflowList } from '../../common/models/workflow.interface';
import { WorkflowService } from '../../common/services/workflow.service';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrl: './workflow-list.component.scss'
})
export class WorkflowListComponent {

  headerTitle: string = "Flujos de Trabajo"
  datatable: IWorkflowList[] = []
  loading: boolean = true;
  totalRecords: number = 0
  pageSize: number = 10

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private notification: NotificationService,
  ) { }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getDatatable() {
    this.loading = true;
    this.datatable = []

    this.workflowService.get().subscribe({
      next: (response: IWorkflowList[]) => {
        this.datatable = response
        this.totalRecords = response.length
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

  goToEdit(id: number) {
    this.router.navigate(['../edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  deleteById(id: number) {
    this.notification.confirm('¿Deseas eliminar el Registro?').then(confirmado => {
      if (!confirmado)
        return;

      this.workflowService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getDatatable();
        }
      });
    });
  }
}
