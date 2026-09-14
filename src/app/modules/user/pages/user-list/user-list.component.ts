import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { UsuarioService } from '../../common/services/usuario.service';
import { IUsuario } from '../../common/models/usuario.interface';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  usuarios: IUsuario[] = []
  loading: boolean = true;
  pageSize: number = 10

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    this.getUsers()
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getUsers() {
    this.loading = true;
    this.usuarios = []

    this.usuarioService.get().subscribe({
      next: (response: IUsuario[]) => {
        this.usuarios = response
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

  goToViewUser(id: number) {
    this.router.navigate(['../view', id], {
      relativeTo: this.activatedRoute
    });
  }

  goToEditUser(id: number) {
    this.router.navigate(['../edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  deleteUserById(id: number) {
    this.notification.confirm('¿Deseas eliminar el usuario?').then(confirmado => {
      if (!confirmado)
        return;

      this.usuarioService.delete(id).subscribe({
        next: (response: IMessage) => {
          this.notification.success(response.message);
          this.getUsers();
        }
      });
    });
  }
}
