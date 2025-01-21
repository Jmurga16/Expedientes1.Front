import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { IUsuario } from '../models/usuario.interface';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IUsuarioForm } from '../models/usuario-form.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/user`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<IUsuario>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<IUsuario>>(`${this._api}`, { params });
  }

  getById(id: number): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this._api}/${id}`);
  }

  getByEmail(email: string): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this._api}/email/${email}`);
  }

  create(request: IUsuarioForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: IUsuarioForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

}
