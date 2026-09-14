import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment';
import { IMessage } from '../../../../core/models/generic/message.interface';
import { IWorkflow, IWorkflowList } from '../models/workflow.interface';
import { IWorkflowForm } from '../models/workflow-form.interface';
import { SILENCIAR_ERROR } from '../../../../core/interceptors/error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/workflow`;
  }

  get(): Observable<IWorkflowList[]> {
    return this.http.get<IWorkflowList[]>(`${this._api}`);
  }

  getActives(): Observable<IWorkflow[]> {
    return this.http.get<IWorkflow[]>(`${this._api}/activos`);
  }

  getById(id: number): Observable<IWorkflow> {
    return this.http.get<IWorkflow>(`${this._api}/${id}`);
  }

  exists(idTipoDemanda: number, idTipologia: number, idSubtipologia: number): Observable<boolean> {
    const params = new HttpParams()
      .set('idTipoDemanda', idTipoDemanda)
      .set('idTipologia', idTipologia)
      .set('idSubtipologia', idSubtipologia);

    return this.http.get<boolean>(`${this._api}/exists`, {
      params,
      context: new HttpContext().set(SILENCIAR_ERROR, true)
    });
  }

  create(request: IWorkflowForm): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._api}`, request);
  }

  update(request: IWorkflowForm): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._api}/${request.id}`, request);
  }

  delete(id: number): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._api}/${id}`);
  }
}
