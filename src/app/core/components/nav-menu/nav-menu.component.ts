import { Component } from '@angular/core';
import { TokenService } from '../../../auth/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {

  sidebarVisible: boolean = true;


  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {


  }

  menuItems = [
    { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Perfil', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Configuración', icon: 'pi pi-cog', routerLink: '/settings' },
    { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  menuData = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '/profile',
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  logout() {
    this.tokenService.logOut();
    this.router.navigate(['auth/login']);
  }
  
}
