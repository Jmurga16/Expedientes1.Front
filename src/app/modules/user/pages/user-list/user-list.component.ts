import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../common/services/usuario.service';
import { IUsuario } from '../../common/models/usuario.interface';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  usuarios: IUsuario[] = []
  loading: boolean = true;
  request: any = { search: "", pageIndex: 1, pageSize: 10 }
  totalRecords: number = 0

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioHttp: UsuarioService
  ) { }

  ngOnInit() {

  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getUsers(event?: any) {

    if (event) {
      this.request.pageSize = event.rows
      this.request.pageIndex = (event.first / this.request.pageSize) + 1
      this.request.search = event.globalFilter
    }

    this.loading = true;
    this.usuarios = []

    this.usuarioHttp.get(this.request).subscribe({
      next: (response: IPaginatedList<IUsuario>) => {
        this.usuarios = response.items
        this.totalRecords = response.totalRecords
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToNewUser() {
    this.router.navigate(['../create'], {
      relativeTo: this.activatedRoute,
    });
  }

  goToEditUser(id: any) {
    this.router.navigate(['../edit', id], {
      relativeTo: this.activatedRoute
    });
  }
}
