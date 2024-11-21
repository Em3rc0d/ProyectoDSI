import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  email: string = '';
  password: string = '';
  role: string = '';
  message: string = '';
  messageType: string = '';
  isLoading: boolean = false; // Agregar esta propiedad para controlar el estado de carga

  constructor(private authService: AuthService, 
    private router: Router,
    private userService: UserService
  ) {}

  
  login() {
    this.isLoading = true; // Activamos el estado de carga
    const credentials = { email: this.email, password: this.password };
  
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);  // Guardar token en sessionStorage
        sessionStorage.setItem('role', response.rol);  // Guardar el rol en sessionStorage
        this.message = 'Inicio de sesión exitoso';
        this.messageType = 'success';
        setTimeout(() => this.router.navigate(['/home/']), 1000); // Redirige después de 2 segundos
      },
      error: (err) => {
        this.message = 'Error al iniciar sesión: ' + err.message;
        this.messageType = 'error';
      },
      complete: () => {
        this.isLoading = false; // Desactivamos el estado de carga cuando la solicitud termina
      }
    });
  }
  
}
