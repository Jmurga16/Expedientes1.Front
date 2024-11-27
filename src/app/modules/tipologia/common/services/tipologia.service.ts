import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { ITipologia } from '../models/tipologia.interface';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { ITipologiaForm } from '../models/tipologia-form.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';



@Injectable({
  providedIn: 'root',
})
export class TipologiaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/tipologia`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<ITipologia>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<ITipologia>>(`${this._api}`, { params });
  }

  getById(id: number): Observable<ITipologia> {
    return this.http.get<ITipologia>(`${this._api}/${id}`);
  }

  create(request: ITipologiaForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: ITipologiaForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

  /* getRoles(): Observable<IRoles[]> {
    return this.http.get<IRoles[]>(`${this._api}/listar-rol`);
  }

  gettipologiaByRol(codigo: string): Observable<ITipologiaByRol[]> {
    return this.http.get<ITipologiaByRol[]>(`${this._api}/listar-por-rol/${codigo}`);
  } */

}
