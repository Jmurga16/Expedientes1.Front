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
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { TopbarComponent } from '../topbar/topbar.component';


@NgModule({
  declarations: [
    NavMenuComponent,
    LayoutComponent,
    MenuItemComponent,
    TopbarComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutRoutingModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    OverlayModule,
    ButtonModule,
    OverlayPanelModule,
    AvatarModule
  ]
})
export class LayoutModule { }
