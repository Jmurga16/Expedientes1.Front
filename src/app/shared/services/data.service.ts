import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private jsonUrl = '/assets/demo/data/';

  constructor(private http: HttpClient) { }

  getTipoDemanda(): Observable<any> {
    return this.http.get<any>(this.jsonUrl + "tipo-demanda.json");
  }

  getEstadosStep(): Observable<any> {
    return this.http.get<any>(this.jsonUrl + "estado-step.json");
  }

}