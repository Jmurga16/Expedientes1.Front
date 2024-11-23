import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { TokenService } from '../../../auth/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private tokenService: TokenService, private router: Router) { }

  overlayVisible: boolean = false;

  toggle() {
    this.overlayVisible = !this.overlayVisible;
  }

  logout() {
    this.tokenService.logOut();
    this.router.navigate(['auth/login']);
  }
}