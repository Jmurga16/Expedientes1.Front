import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';
import { IDemanda } from '../models/demanda.interface';
import { IDemandaForm } from '../models/demanda-form.interface';



@Injectable({
  providedIn: 'root',
})
export class DemandaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/demanda`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<IDemanda>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<IDemanda>>(`${this._api}`, { params });
  }

  getActives(): Observable<IPaginatedList<IDemanda>> {
    return this.http.get<IPaginatedList<IDemanda>>(`${this._api}/activos`);
  }

  getById(id: number): Observable<IDemanda> {
    return this.http.get<IDemanda>(`${this._api}/${id}`);
  }

  create(request: IDemandaForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: IDemandaForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

}
