import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('../../../modules/user/user.module').then(m => m.UserModule)
      }/* ,
      {
        path: 'inventory',
        loadChildren: () => import('../../../modules/inventory/inventory.module').then(m => m.InventoryModule)
      } */,
    ]
  },

  {
    path: '**', redirectTo: 'auth/login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
