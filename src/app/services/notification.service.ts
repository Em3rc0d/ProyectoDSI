import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifyLowStock(): void {
    Swal.fire({
      title: 'Alerta de Inventario Bajo',
      text: 'Se ha generado un informe de inventario bajo. Revisa los detalles.',
      icon: 'warning',
      confirmButtonText: 'Ver Informe'
    });
  }

  notifyError(errorMessage: string): void {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}
