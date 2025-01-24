import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { BpmnComponent } from './components/bpmn/bpmn.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import { ButtonModule } from 'primeng/button';
import { StepTaskPipe } from './pipes/step-task.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        RolePipe,
        BpmnComponent,
        DiagramComponent,
        StepTaskPipe
    ],
    imports: [
        CommonModule,
        ButtonModule,
        DropdownModule,
        ReactiveFormsModule
    ],
    exports: [
        RolePipe,
        StepTaskPipe,
        BpmnComponent,
        DiagramComponent,
    ],
    providers: [DialogService]
})
export class SharedModule { }