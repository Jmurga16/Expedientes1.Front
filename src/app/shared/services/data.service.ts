import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private jsonUrl = '/assets/demo/data/';

  constructor(private http: HttpClient) { }

  getTipoDemanda(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/tipo-demanda`);
  }

  getEstadosStep(): Observable<any> {
    return this.http.get<any>(this.jsonUrl + "estado-step.json");
  }

}
