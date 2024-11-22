import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { UserListComponent } from './pages/user-list/user-list.component';


@NgModule({
  declarations: [
    ListUserComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
