import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../common/services/usuario.service';
import { IUsuario } from '../../common/models/usuario.interface';
import Swal from 'sweetalert2';


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
    private usuarioService: UsuarioService
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

    this.usuarioService.get(this.request).subscribe({
      next: (response: any) => {
        console.log(response)
        this.usuarios = response
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

  deleteUserById(id: any) {

    Swal.fire({
      title: "¿Deseas eliminar el usuario?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(id).subscribe({
          next: (response: any) => {
            console.log(response)
            if (response.status == "OK") {
              Swal.fire({
                title: response.message,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              })
              this.getUsers();
            }
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo eliminar el usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          }
        });
      }
    });

  }

}
