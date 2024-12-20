import { Component, ElementRef } from '@angular/core';
import { TokenService } from '../../../auth/services/token.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {

  model: any[] = [];

  constructor(public layoutService: LayoutService,
    private tokenService: TokenService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Menú',
        items: [
          { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['./home'] },
          { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['user/list'] },
          { label: 'Tipología', icon: 'pi pi-fw pi-th-large', routerLink: ['tipologia/list'] },
          { label: 'SubTipología', icon: 'pi pi-fw pi-table', routerLink: ['tipologia/subtipologia/list'] },
          { label: 'Area', icon: 'pi pi-fw pi-map', routerLink: ['area/list'] },
          { label: 'Demandas', icon: 'pi pi-fw pi-list', routerLink: ['demanda/list'] },
          { label: 'Flujos de Trabajo', icon: 'pi pi-fw pi-share-alt', routerLink: ['workflow/list'] },
          //{ label: 'Configuración', icon: 'pi pi-fw pi-cog', routerLink: ['configuration'] },
          { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', routerLink: ['/auth/login'] },
        ]
      },
    ];
  }

}
