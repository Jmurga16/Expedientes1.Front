import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    NavMenuComponent,
    LayoutComponent,
    MenuItemComponent,
    TopbarComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RippleModule,
    RouterModule,
    OverlayPanelModule,
    SharedModule
  ]
})
export class LayoutModule { }
