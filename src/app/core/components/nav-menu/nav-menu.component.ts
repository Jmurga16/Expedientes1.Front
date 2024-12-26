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
        this.model = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
