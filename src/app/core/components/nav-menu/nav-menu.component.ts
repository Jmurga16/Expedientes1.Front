import { Component, ElementRef } from '@angular/core';
import { TokenService } from '../../../auth/services/token.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {

  model: any[] = [];

  constructor(public layoutService: LayoutService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.model = [
      
      {
        label: 'Menú',
        items: [
          { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['./home'] },
          { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['user/list'] },
          { label: 'Demandas', icon: 'pi pi-fw pi-list', routerLink: ['demand'] },
          { label: 'Flujos de Trabajo', icon: 'pi pi-fw pi-share-alt', routerLink: ['workflow'] },
          { label: 'Configuración', icon: 'pi pi-fw pi-cog', routerLink: ['configuration'] },
          { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', routerLink: ['/auth/login'] },
        ]
      },
    ];
  }

}
