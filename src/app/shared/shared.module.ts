import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { BpmnComponent } from './components/bpmn/bpmn.component';
import { DiagramComponent } from './components/diagram/diagram.component';

@NgModule({
    declarations: [
        RolePipe,
        BpmnComponent,
        DiagramComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        RolePipe,
        BpmnComponent,
        DiagramComponent,
    ],
    providers: [DialogService]
})
export class SharedModule { }