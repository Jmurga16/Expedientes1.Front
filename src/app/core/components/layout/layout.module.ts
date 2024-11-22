import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { LayoutComponent } from './layout.component';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItemComponent } from '../menu-item/menu-item.component';


@NgModule({
  declarations: [
    NavMenuComponent,
    LayoutComponent,
    MenuItemComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    MenuModule
  ]
})
export class LayoutModule { }
