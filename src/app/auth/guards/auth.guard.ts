import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService);
  const router = inject(Router)

  if (tokenService.isAuthenticated()) {
    return true;
  }
  else {
    return router.navigate(['auth/login'])
  }
};
