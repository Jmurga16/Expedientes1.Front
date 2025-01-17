import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const AdminGuard: CanActivateFn = (route, state) => {

    const tokenService = inject(TokenService);
    const router = inject(Router)

    if (tokenService.isAdmin()) {
        return true;
    }
    else {
        return false;
        //return router.navigate(['/admin/home'])
    }
};
