import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { LayoutComponent } from './layout.component';


@NgModule({
  declarations: [
    NavMenuComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
