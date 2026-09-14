import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { ISubtipologia } from '../models/subtipologia.interface';
import { ISubtipologiaForm } from '../models/subtipologia-form.interface';

@Injectable({
  providedIn: 'root',
})
export class SubtipologiaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/subtipologia`;
  }

  getByIdTipologia(idTipologia: number): Observable<ISubtipologia[]> {
    return this.http.get<ISubtipologia[]>(`${this._api}/tipologia/${idTipologia}`);
  }

  getById(id: number): Observable<ISubtipologia> {
    return this.http.get<ISubtipologia>(`${this._api}/${id}`);
  }

  create(request: ISubtipologiaForm): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._api}`, request);
  }

  update(request: ISubtipologiaForm): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._api}/${request.id}`, request);
  }

  delete(id: number): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._api}/${id}`);
  }
}
