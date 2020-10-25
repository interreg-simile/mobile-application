import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private logger: NGXLogger,
    private router: Router
  ) {
  }

  async canActivate(): Promise<boolean> {
    await this.authService
      .retrieveAuthStatus()
      .catch((err) => this.logger.error('Error retrieving auth status', err));

    if (!this.authService.isUserAuthenticated()) {
      await this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
