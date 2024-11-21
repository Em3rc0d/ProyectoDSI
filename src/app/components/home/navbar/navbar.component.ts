import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router si rediriges tras logout
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule], // Asegúrate de incluir dependencias necesarias
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // Cambiar a styleUrls
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private router: Router) {} // Inyecta Router para redirección si es necesario

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
    console.log('Sesión cerrada');
  }
}
