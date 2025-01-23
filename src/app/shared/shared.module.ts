import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { BpmnComponent } from './components/bpmn/bpmn.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import { ButtonModule } from 'primeng/button';
import { StepTaskPipe } from './pipes/step-task.pipe';

@NgModule({
    declarations: [
        RolePipe,
        BpmnComponent,
        DiagramComponent,
        StepTaskPipe
    ],
    imports: [
        CommonModule,
        ButtonModule
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