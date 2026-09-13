import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';
import { environment } from '../../../environments/environment';

export const TokenInterceptor: HttpInterceptorFn = (request, next) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const token = tokenService.getToken();
    const isBlobRequest = request.url.includes(environment.azureBlob);

    if (token && !isBlobRequest) {
        request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && token && !isBlobRequest) {
                tokenService.logOut();
                router.navigate(['auth/login']);
            }
            return throwError(() => error);
        })
    );
};
