import { Component, ElementRef, OnInit } from '@angular/core';
import { TokenService } from '../../../auth/services/token.service';
import { LayoutService } from '../../services/layout.service';
import { IMenu } from '../../models/menu.interface';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent implements OnInit {

  model: IMenu[] = [];
  loading: boolean = false

  constructor(public layoutService: LayoutService,
    private tokenService: TokenService,
    private menuService: MenuService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.getMenu()
  }

  getMenu() {

    let currentRol = this.tokenService.getCurrentRol()

    this.menuService.getMenuByRol(currentRol).subscribe({
      next: (response: any) => {

        console.log(response)
        if (response) {
          this.model = response;
        }
        
        this.loading = false;
      },
      error: () => {
        this.getMenuAdmin()
        this.loading = false;

      }
    });
  }

  getMenuAdmin() {
    this.model = [
      {
        "label": "Menú",
        "items": [
          {
            "label": "Home",
            "icon": "pi pi-fw pi-home",
            "routerLink": [
              "./home"
            ]
          },
          {
            "label": "Usuarios",
            "icon": "pi pi-fw pi-user",
            "routerLink": [
              "user/list"
            ]
          },
          {
            "label": "Tipología",
            "icon": "pi pi-fw pi-th-large",
            "routerLink": [
              "tipologia/list"
            ]
          },
          {
            "label": "SubTipología",
            "icon": "pi pi-fw pi-table",
            "routerLink": [
              "tipologia/subtipologia/list"
            ]
          },
          {
            "label": "Area",
            "icon": "pi pi-fw pi-map",
            "routerLink": [
              "area/list"
            ]
          },
          {
            "label": "Demandas",
            "icon": "pi pi-fw pi-list",
            "routerLink": [
              "demanda/list"
            ]
          },
          {
            "label": "Flujos de Trabajo",
            "icon": "pi pi-fw pi-share-alt",
            "routerLink": [
              "workflow/list"
            ]
          },
          {
            "label": "Cerrar Sesión",
            "icon": "pi pi-fw pi-sign-out",
            "routerLink": [
              "/auth/login"
            ]
          }
        ]
      }
    ]
  }
}
