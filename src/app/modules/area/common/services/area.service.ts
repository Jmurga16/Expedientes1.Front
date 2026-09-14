import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IMessage } from '../../../../core/models/generic/message.interface';
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

  get(): Observable<IArea[]> {
    return this.http.get<IArea[]>(`${this._api}`);
  }

  getActives(): Observable<IArea[]> {
    return this.http.get<IArea[]>(`${this._api}/activos`);
  }

  getById(id: number): Observable<IArea> {
    return this.http.get<IArea>(`${this._api}/${id}`);
  }

  create(request: IAreaForm): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._api}`, request);
  }

  update(request: IAreaForm): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._api}/${request.id}`, request);
  }

  delete(id: number): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._api}/${id}`);
  }
}
