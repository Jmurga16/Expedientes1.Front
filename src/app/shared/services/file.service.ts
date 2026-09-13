import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
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

    uploadBlob(file: Blob, containerName: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this._api}/${containerName}`, formData);
    }

    // Los contenedores son privados: un blob solo se lee con la URL firmada que emite el backend.
    resolveUrl(url: string): Observable<string> {
        if (!url || !url.startsWith(environment.azureBlob))
            return of(url);

        return this.http.get<{ url: string }>(`${this._api}/view`, { params: { url } })
            .pipe(map(response => response.url));
    }

    downloadFile(filename: string, data: string | Blob, type: string): void {
        const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }


}
