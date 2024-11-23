import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
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
    this._api = `${environment.apiUrl}/Usuario`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<IUsuario>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<IUsuario>>(`${this._api}`, { params });
  }

  getById(id: number): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this._api}/${id}`);
  }

  create(request: IUsuarioForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: IUsuarioForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}`, request);
  }

  /* getRoles(): Observable<IRoles[]> {
    return this.http.get<IRoles[]>(`${this._api}/listar-rol`);
  }

  getUserByRol(codigo: string): Observable<IUsuarioByRol[]> {
    return this.http.get<IUsuarioByRol[]>(`${this._api}/listar-por-rol/${codigo}`);
  } */

}
