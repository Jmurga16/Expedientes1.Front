import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AreaService {


    constructor(private http: HttpClient) {
    }

    getAreas() {
        return this.http.get<any>('assets/demo/data/area.json');
    }

}
