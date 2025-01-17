import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandaListComponent } from './pages/demanda-list/demanda-list.component';
import { DemandaFormComponent } from './pages/demanda-form/demanda-form.component';
import { DemandaWorkflowComponent } from './pages/demanda-workflow/demanda-workflow.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: DemandaListComponent
  },
  {
    path: 'create',
    component: DemandaFormComponent
  },
  {
    path: 'edit/:id',
    component: DemandaFormComponent
  },
  {
    path: 'diagram/:id',
    component: DemandaWorkflowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandaRoutingModule { }
