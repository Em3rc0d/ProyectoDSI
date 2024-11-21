import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userRole = this.authService.getUserRole(); // Suponiendo que este método te da el rol del usuario

    // Verifica si el rol del usuario está permitido para esta ruta
    if (route.data['roles'] && route.data['roles'].includes(userRole)) {
      return true;
    }

    // Si no tiene el rol adecuado, redirige al login o a una página de acceso denegado
    this.router.navigate(['/access-denied']);
    return false;
  }
}
