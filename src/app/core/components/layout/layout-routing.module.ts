import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from '../../../shared/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../../../modules/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'tipologia',
        loadChildren: () =>
          import('../../../modules/tipologia/tipologia.module').then((m) => m.TipologiaModule),
      }
      ,
      {
        path: 'home',
        component: HomeComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
