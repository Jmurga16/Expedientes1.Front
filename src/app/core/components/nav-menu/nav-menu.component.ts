import { Component, ElementRef, OnInit } from '@angular/core';
import { TokenService } from '../../../auth/services/token.service';
import { IMenu } from '../../models/menu.interface';
import { MenuService } from '../../services/menu.service';

const MENU_MINIMO: IMenu[] = [
  {
    label: 'Menú',
    items: [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['./home'] },
      { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', routerLink: ['/auth/login'], action: 'logout' }
    ]
  }
];

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent implements OnInit {

  model: IMenu[] = [];
  loading: boolean = false

  constructor(
    private tokenService: TokenService,
    private menuService: MenuService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.getMenu()
  }

  getMenu() {
    this.menuService.getMenuByRol(this.tokenService.getCurrentRol()).subscribe({
      next: (response: IMenu[]) => {
        this.model = response?.length ? response : MENU_MINIMO;
        this.loading = false;
      },
      error: () => {
        this.model = MENU_MINIMO;
        this.loading = false;
      }
    });
  }
}
