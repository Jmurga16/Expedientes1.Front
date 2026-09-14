import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { IUsuario } from '../models/usuario.interface';
import { IUsuarioForm } from '../models/usuario-form.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/user`;
  }

  get(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(`${this._api}`);
  }

  getById(id: number): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this._api}/${id}`);
  }

  getMe(): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this._api}/me`);
  }

  create(request: IUsuarioForm): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._api}`, request);
  }

  update(request: IUsuarioForm): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._api}/${request.id}`, request);
  }

  delete(id: number): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._api}/${id}`);
  }
}
