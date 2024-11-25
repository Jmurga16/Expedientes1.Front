import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';

@NgModule({
    declarations: [
        RolePipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        RolePipe,
    ]
})
export class SharedModule { }