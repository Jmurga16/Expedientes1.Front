import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
    declarations: [
        RolePipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        RolePipe,
    ],
    providers: [DialogService]
})
export class SharedModule { }