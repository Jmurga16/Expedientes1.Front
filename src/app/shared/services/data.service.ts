import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ITipoDemanda } from '../models/tipo-demanda.interface';
import { IOpcion } from '../models/opcion.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private jsonUrl = '/assets/demo/data/';

  constructor(private http: HttpClient) { }

  getTipoDemanda(): Observable<ITipoDemanda[]> {
    return this.http.get<ITipoDemanda[]>(`${environment.apiUrl}/tipo-demanda`);
  }

  getEstadosStep(): Observable<IOpcion[]> {
    return this.http.get<IOpcion[]>(this.jsonUrl + 'estado-step.json');
  }
}
