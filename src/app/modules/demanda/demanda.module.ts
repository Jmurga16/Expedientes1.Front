import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandaRoutingModule } from './demanda-routing.module';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';


import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DemandaListComponent } from './pages/demanda-list/demanda-list.component';
import { DemandaFormComponent } from './pages/demanda-form/demanda-form.component';
import { DemandaWorkflowComponent } from './pages/demanda-workflow/demanda-workflow.component';
import { HistorialDemandaListModalComponent } from './pages/historial-demanda-list-modal/historial-demanda-list-modal.component';

const PRIMENG_MODULES = [
  ButtonModule,
  CardModule,
  CheckboxModule,
  DialogModule,
  DynamicDialogModule,
  DropdownModule,
  InputTextModule,
  InputTextareaModule,
  MultiSelectModule,
  ProgressBarModule,
  RadioButtonModule,
  SliderModule,
  TableModule,
  TabViewModule,
  TooltipModule,
  TreeTableModule,
  TreeModule,
  DividerModule,
  FileUploadModule 
];

@NgModule({
  declarations: [
    DemandaListComponent,
    DemandaFormComponent,
    DemandaWorkflowComponent,
    HistorialDemandaListModalComponent
  ],
  imports: [
    CommonModule,
    DemandaRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,
    ...PRIMENG_MODULES,
    SharedModule
  ]
})
export class DemandaModule { }
