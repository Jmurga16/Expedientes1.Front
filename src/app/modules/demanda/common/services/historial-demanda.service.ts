import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IHistorialDemandaList } from '../models/historial-demanda-list.interface';

@Injectable({
    providedIn: 'root',
})
export class HistorialDemandaService {
    private _api: string;

    constructor(private http: HttpClient) {
        this._api = `${environment.apiUrl}/historial-demanda`;
    }

    get(idDemanda: number): Observable<IHistorialDemandaList[]> {
        return this.http.get<IHistorialDemandaList[]>(`${this._api}/${idDemanda}`);
    }
}
