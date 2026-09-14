import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { ITipologia } from '../models/tipologia.interface';
import { ITipologiaForm } from '../models/tipologia-form.interface';

@Injectable({
  providedIn: 'root',
})
export class TipologiaService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/tipologia`;
  }

  get(): Observable<ITipologia[]> {
    return this.http.get<ITipologia[]>(`${this._api}`);
  }

  getActives(): Observable<ITipologia[]> {
    return this.http.get<ITipologia[]>(`${this._api}/activos`);
  }

  getById(id: number): Observable<ITipologia> {
    return this.http.get<ITipologia>(`${this._api}/${id}`);
  }

  create(request: ITipologiaForm): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._api}`, request);
  }

  update(request: ITipologiaForm): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._api}/${request.id}`, request);
  }

  delete(id: number): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._api}/${id}`);
  }
}
