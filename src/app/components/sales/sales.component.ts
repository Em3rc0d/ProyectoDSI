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
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
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
      },
    });
  }
  editarVenta(venta: any): void {
    // Obtener todos los productos disponibles
    this.saleService.obtenerProductos().subscribe({
      next: (productosDisponibles: { _id: any; nombre: string; precio_unitario: number }[]) => {
        // Mostrar el popup de edición con SweetAlert2
        Swal.fire({
          title: 'Editar Venta',
          html: `
            <label for="productos">Productos actuales:</label>
            <select id="productos" class="swal2-input" multiple>
              ${venta.productos
                .map((producto: { productoId: any; nombre: string; precio_unitario: number }) => `
                  <option value="${producto.productoId}" data-precio="${producto.precio_unitario}" selected>
                    ${producto.nombre} - ${producto.precio_unitario}
                  </option>
                `)
                .join('')}
            </select>
  
            <label for="productosDisponibles">Productos disponibles:</label>
            <select id="productosDisponibles" class="swal2-input" multiple>
              ${productosDisponibles
                .map((producto: { _id: any; nombre: string; precio_unitario: number }) => `
                  <option value="${producto._id}" data-precio="${producto.precio_unitario}">
                    ${producto.nombre} - ${producto.precio_unitario}
                  </option>
                `)
                .join('')}
            </select>
          `,
          preConfirm: () => {
            const productosSeleccionados = Array.from(
              (<HTMLSelectElement>document.getElementById('productos')).selectedOptions
            ).map((option) => ({
              productoId: option.value,
              precio_unitario: parseFloat(option.getAttribute('data-precio') || '0'),
            }));
  
            const productosDisponiblesSeleccionados = Array.from(
              (<HTMLSelectElement>document.getElementById('productosDisponibles')).selectedOptions
            ).map((option) => ({
              productoId: option.value,
              precio_unitario: parseFloat(option.getAttribute('data-precio') || '0'),
            }));
  
            return {
              productosSeleccionados,
              productosDisponiblesSeleccionados,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const datosActualizados = result.value;
  
            // Calcular los subtotales y cantidades para los productos
            const productosActualizados = [
              ...datosActualizados.productosSeleccionados.map((producto: any) => ({
                productoId: producto.productoId,
                cantidad: 1, // Ajusta la cantidad si es necesario
                precio_unitario: producto.precio_unitario,
                subtotal: producto.precio_unitario * 1, // Aquí multiplicas por la cantidad
              })),
              ...datosActualizados.productosDisponiblesSeleccionados.map((producto: any) => ({
                productoId: producto.productoId,
                cantidad: 1, // Ajusta la cantidad si es necesario
                precio_unitario: producto.precio_unitario,
                subtotal: producto.precio_unitario * 1, // Aquí multiplicas por la cantidad
              })),
            ];
  
            // Solo actualizamos los productos en el backend
            const updatedVenta = { productos: productosActualizados };
  
            // Actualizar la venta con los nuevos productos
            this.saleService
              .actualizarVenta(venta._id, updatedVenta)
              .subscribe({
                next: (response) => {
                  this.obtenerVentas(); // Recargar las ventas después de editar
                  Swal.fire('¡Éxito!', 'Los productos de la venta han sido actualizados.', 'success');
                },
                error: (error) => {
                  Swal.fire('Error', 'Hubo un problema al actualizar los productos de la venta.', 'error');
                },
              });
          }
        });
      },
      error: (error: any) => {
        Swal.fire('Error', 'Hubo un problema al obtener los productos disponibles.', 'error');
      },
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.eliminarVenta(ventaId).subscribe({
          next: () => {
            this.obtenerVentas(); // Recargar las ventas después de eliminar
            Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la venta.',
              'error'
            );
          },
        });
      }
    });
  }
}
