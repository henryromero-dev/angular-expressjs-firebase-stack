import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ServerService } from '../services/server.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticableGuard implements CanActivate {
    constructor(private server: ServerService, private router: Router) { };
    
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        if (!this.server.isAuthenticated) {
            this.router.navigate(['/account/login']);
            return false;
        }

        return true;
    }
}

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private server: ServerService, private router: Router) { };

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.server.isAuthenticated) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
