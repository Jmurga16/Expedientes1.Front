import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IHistorialDemandaList } from '../models/historial-demanda-list.interface';


@Injectable({
    providedIn: 'root',
})
export class HistorialDemandaService {
    private _api: string;

    constructor(private http: HttpClient) {
        this._api = `${environment.apiUrl}/historial-demanda`;
    }

    get(idDemanda: number, request: IPaginatedFilter): Observable<IPaginatedList<IHistorialDemandaList>> {
        const params = HttpParamsUtility.buildHttpParams(request);

        return this.http.get<IPaginatedList<IHistorialDemandaList>>(`${this._api}/${idDemanda}`, { params });
    }

}
