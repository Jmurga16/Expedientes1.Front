import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';

const AUTH = 'Authorization';
const BEARER = 'Bearer ';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private tokenService: TokenService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let intReq = request;
        const token = this.tokenService.getToken();
        if (token != null) {
            intReq = request.clone({ headers: request.headers.set(AUTH, BEARER + token) });
        }
        return next.handle(intReq);
    }
}
