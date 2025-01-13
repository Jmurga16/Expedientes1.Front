import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../auth/services/token.service';
import { environment } from '../../../environments/environment';

export const TokenInterceptor: HttpInterceptorFn = (request, next) => {
    const tokenService = inject(TokenService);

    const token = tokenService.getToken();
    const isBlobRequest = request.url.includes(environment.azureBlob);

    if (token && !isBlobRequest) {
        request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(request);
};