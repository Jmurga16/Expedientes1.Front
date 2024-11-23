import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../auth/services/token.service';

export const TokenInterceptor: HttpInterceptorFn = (request, next) => {
    const tokenService = inject(TokenService);

    const token = tokenService.getToken();
    //console.log(token)

    if (token) {
        request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(request);
};