import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipologiaListComponent } from './pages/tipologia-list/tipologia-list.component';
import { SubtipologiaListComponent } from './pages/subtipologia-list/subtipologia-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: TipologiaListComponent
  },
  {
    path: 'subtipologia/:id',
    component: SubtipologiaListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipologiaRoutingModule { }
