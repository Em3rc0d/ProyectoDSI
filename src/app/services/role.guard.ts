import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Servicio de autenticación
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
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

    Swal.fire({
      title: 'Acceso restringido',
      text: 'No tienes los permisos necesarios para ver esta página.',
      icon: 'warning',
      confirmButtonText: 'Volver a intentar',
      showCancelButton: true,
      cancelButtonText: 'Salir',
    }).then(result => {
      if (result.isConfirmed) {
        // Si el usuario hace clic en 'Volver a intentar', redirige al login
        this.router.navigate(['/login']);
      } else {
        // Si hace clic en 'Salir', redirige a la página de inicio
        this.router.navigate(['/home']);
      }
    });
    
    
    return false;
  }
}
