import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private jsonUrl = 'assets/demo/data/';

    constructor(private httpClient: HttpClient) {

    }

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    getMenuByRol(rol: string): Observable<any> {
        return this.httpClient.get<any>(this.jsonUrl + `menu/menu-${rol}.json`);
    }
}
