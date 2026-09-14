import { inject } from '@angular/core';
import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const SILENCIAR_ERROR = new HttpContextToken<boolean>(() => false);

const MENSAJE_GENERICO = 'No se pudo completar la operación por un error del servidor. Intente nuevamente en unos minutos.';
const MENSAJE_SIN_CONEXION = 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.';

export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
    const notification = inject(NotificationService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (notificable(request.context.get(SILENCIAR_ERROR), request.headers.has('Authorization'), error)) {
                notification.error(mensaje(error));
            }
            return throwError(() => error);
        })
    );
};

function mensaje(error: HttpErrorResponse): string {
    if (error.status === 0)
        return MENSAJE_SIN_CONEXION;
    return error.error?.message ?? MENSAJE_GENERICO;
}

function notificable(silenciado: boolean, conToken: boolean, error: HttpErrorResponse): boolean {
    if (silenciado)
        return false;
    if (error.status === 401 && conToken)
        return false;
    return !error.error?.code;
}
