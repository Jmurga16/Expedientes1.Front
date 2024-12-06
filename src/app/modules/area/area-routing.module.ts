import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaListComponent } from './pages/area-list/area-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: AreaListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
