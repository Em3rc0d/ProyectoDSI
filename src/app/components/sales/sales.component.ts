import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit{
  ventas: any[] = [];
  constructor(private saleService: SaleService) {}
  
  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this.saleService.obtenerVentas().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (error) => {
        console.error('Error al obtener las ventas', error);
      }
    });
  }
  editarVenta(venta: any): void {
    // Mostrar el popup de edición con SweetAlert2
    Swal.fire({
      title: 'Editar Venta',
      html: `
        <input id="cliente" class="swal2-input" placeholder="Cliente" value="${venta.cliente}">
        <input id="total" class="swal2-input" placeholder="Total" value="${venta.total}">
        
        <!-- Campo Productos (Ejemplo simple) -->
        <select id="productos" class="swal2-input">
          ${venta.productos.map((producto: { productoId: any; nombre: any; precio_unitario: number; }) => `
            <option value="${producto.productoId}" selected>${producto.nombre} - ${producto.precio_unitario }</option>
          `).join('')}
        </select>
      `,
      preConfirm: () => {
        const cliente = (<HTMLInputElement>document.getElementById('cliente')).value;
        const total = (<HTMLInputElement>document.getElementById('total')).value;
        const productosSeleccionados = (<HTMLSelectElement>document.getElementById('productos')).value;
  
        return { cliente, total, productosSeleccionados };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const datosActualizados = result.value;
        const updatedVenta = { 
          ...venta, 
          cliente: datosActualizados.cliente,
          total: datosActualizados.total,
          productos: datosActualizados.productosSeleccionados // Si productos es un array, será necesario procesarlo
        };
  
        // Actualizar la venta con los nuevos datos
        this.saleService.actualizarVenta(venta._id, updatedVenta).subscribe({
          next: (response) => {
            this.obtenerVentas(); // Recargar las ventas después de editar
            Swal.fire('¡Éxito!', 'La venta ha sido actualizada.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al actualizar la venta.', 'error');
          }
        });
      }
    });
  }
  
  

  eliminarVenta(ventaId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta venta se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.eliminarVenta(ventaId).subscribe({
          next: () => {
            this.obtenerVentas(); // Recargar las ventas después de eliminar
            Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar la venta.', 'error');
          }
        });
      }
    });
  }
}
