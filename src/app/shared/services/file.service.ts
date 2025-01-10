import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class FileService {
    private _api: string;

    constructor(private http: HttpClient) {
        this._api = `${environment.apiUrl}/file`;
    }

    uploadFile(file: File, containerName: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this._api}/${containerName}`, formData);
    }

    uploadFileUnique(file: File, containerName: string): Observable<any> {
        const formData = new FormData();

        // Generar un nombre único basado en la fecha/hora
        const uniqueName = `${new Date().getTime()}_${file.name}`;

        // Crear un nuevo archivo con el nombre único
        const renamedFile = new File([file], uniqueName, { type: file.type });

        formData.append('file', renamedFile);

        return this.http.post(`${this._api}/${containerName}`, formData);
    }

}
