import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environments/environment.development';
import { HttpParamsUtility } from '../../../../core/utils/HttpParamsUtility';
import { IPaginatedList } from '../../../../core/models/generic/paginated-list.interface';
import { IPaginatedFilter } from '../../../../core/models/generic/paginated-filter.interface';
import { IResponseForm } from '../../../../core/models/generic/response-form.interface';
import { IWorkflow } from '../models/workflow.interface';
import { IWorkflowForm } from '../models/workflow-form.interface';



@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.apiUrl}/workflow`;
  }

  get(request: IPaginatedFilter): Observable<IPaginatedList<IWorkflow>> {
    const params = HttpParamsUtility.buildHttpParams(request);

    return this.http.get<IPaginatedList<IWorkflow>>(`${this._api}`, { params });
  }

  getActives(): Observable<IPaginatedList<IWorkflow>> {
    return this.http.get<IPaginatedList<IWorkflow>>(`${this._api}/activos`);
  }

  getById(id: number): Observable<IWorkflow> {
    return this.http.get<IWorkflow>(`${this._api}/${id}`);
  }

  create(request: IWorkflowForm): Observable<IResponseForm> {
    return this.http.post<IResponseForm>(`${this._api}`, request);
  }

  update(request: IWorkflowForm): Observable<IResponseForm> {
    return this.http.put<IResponseForm>(`${this._api}/${request.id}`, request);
  }

  delete(id: any): Observable<IResponseForm> {
    return this.http.delete<IResponseForm>(`${this._api}/${id}`);
  }

}
