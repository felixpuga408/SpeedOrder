import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window !== 'undefined' && this.authService.estaAutenticado()) {
      return true;  // Permite el acceso si el usuario está autenticado
    } else {
      this.router.navigate(['/login']);  // Redirige al login si no está autenticado
      return false;
    }
  }
  
}
