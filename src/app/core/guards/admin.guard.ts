import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window !== 'undefined' && this.authService.estaAutenticado() && this.authService.esAdmin()) {
      return true;  // Permite el acceso si el usuario es admin
    } else {
      this.router.navigate(['/']);  // Redirige a home si no es admin
      return false;
    }
  }
  
}
