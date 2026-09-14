import { inject } from '@angular/core';
import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const SILENCIAR_ERROR = new HttpContextToken<boolean>(() => false);

const MENSAJE_GENERICO = 'Ocurrió un error inesperado.';

export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
    const notification = inject(NotificationService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (notificable(request.context.get(SILENCIAR_ERROR), request.headers.has('Authorization'), error)) {
                notification.error(error.error?.message ?? MENSAJE_GENERICO);
            }
            return throwError(() => error);
        })
    );
};

function notificable(silenciado: boolean, conToken: boolean, error: HttpErrorResponse): boolean {
    if (silenciado)
        return false;
    if (error.status === 401 && conToken)
        return false;
    return !error.error?.code;
}
