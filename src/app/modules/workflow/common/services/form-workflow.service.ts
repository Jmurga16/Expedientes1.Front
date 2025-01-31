import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
    providedIn: 'root',
})
export class FormWorkflowService {

    private nombreSubject = new BehaviorSubject<string>('');
    nombre$ = this.nombreSubject.asObservable();

    setNombre(valor: string) {
        this.nombreSubject.next(valor);
    }

}
