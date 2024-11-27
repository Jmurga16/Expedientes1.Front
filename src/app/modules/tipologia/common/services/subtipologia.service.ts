import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { ISubtipologia } from '../models/subtipologia.interface';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { ISubtipologiaForm } from '../models/subtipologia-form.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';



@Injectable({
  providedIn: 'root',
})
export class SubtipologiaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/subtipologia`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<ISubtipologia>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<ISubtipologia>>(`${this._api}`, { params });
  }

  getByIdTipologia(idTipologia: number): Observable<ISubtipologia[]> {
    return this.http.get<ISubtipologia[]>(`${this._api}/tipologia/${idTipologia}`);
  }

  getById(id: number): Observable<ISubtipologia> {
    return this.http.get<ISubtipologia>(`${this._api}/${id}`);
  }

  create(request: ISubtipologiaForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: ISubtipologiaForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

}
