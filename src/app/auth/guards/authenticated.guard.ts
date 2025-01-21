import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {

    const tokenService = inject(TokenService);
    const router = inject(Router)

    if (tokenService.isAuthenticated()) {
        return router.navigate(['/admin/home'])
    }
    else {
        return true
    }
};
