import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IMenu, MenuChangeEvent } from '../models/menu.interface';
import { SILENCIAR_ERROR } from '../interceptors/error.interceptor';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private jsonUrl = '/assets/demo/data/';

    constructor(private httpClient: HttpClient) { }

    private menuSource = new Subject<MenuChangeEvent>();

    menuSource$ = this.menuSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    getMenuByRol(rol: string): Observable<IMenu[]> {
        return this.httpClient.get<IMenu[]>(this.jsonUrl + `menu/menu-${rol}.json`, {
            context: new HttpContext().set(SILENCIAR_ERROR, true)
        });
    }
}
