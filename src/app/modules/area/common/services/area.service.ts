import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';
import { IArea } from '../models/area.interface';
import { IAreaForm } from '../models/area-form.interface';



@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/area`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<IArea>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<IArea>>(`${this._api}`, { params });
  }

  getActives(): Observable<IPaginatedList<IArea>> {
    return this.http.get<IPaginatedList<IArea>>(`${this._api}/activos`);
  }

  getById(id: number): Observable<IArea> {
    return this.http.get<IArea>(`${this._api}/${id}`);
  }

  create(request: IAreaForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: IAreaForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

}
