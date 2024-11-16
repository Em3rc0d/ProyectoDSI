import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  rol: string = 'vendedor';
  message: string = '';  // Variable para los mensajes
  messageType: string = ''; // Para diferenciar entre éxito o error
  isLoading: boolean = false; // Variable para controlar el estado de carga

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.isLoading = true; // Activamos el estado de carga
    const user = { nombre: this.nombre, email: this.email, password: this.password, rol: this.rol };

    this.authService.register(user).subscribe({
      next: () => {
        this.message = 'Usuario registrado exitosamente';
        this.messageType = 'success';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirige después de 2 segundos
      },
      error: (err) => {
        this.message = 'Error al registrar usuario: ' + err.message;
        this.messageType = 'error';
      },
      complete: () => {
        this.isLoading = false; // Desactivamos el estado de carga
      },
    });
  }
}
