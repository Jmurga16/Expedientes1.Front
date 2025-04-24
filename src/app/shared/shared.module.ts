import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RolePipe } from './pipes/role.pipe';
import { StepTaskPipe } from './pipes/step-task.pipe';
import { BpmnComponent } from './components/bpmn/bpmn.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
    declarations: [
        RolePipe,
        BpmnComponent,
        DiagramComponent,
        StepTaskPipe,
        LoadingComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        DropdownModule,
        ReactiveFormsModule,
        ProgressSpinnerModule
    ],
    exports: [
        RolePipe,
        StepTaskPipe,
        BpmnComponent,
        DiagramComponent,
        LoadingComponent
    ],
    providers: [DialogService]
})
export class SharedModule { }