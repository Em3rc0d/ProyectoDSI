import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-edit.component.html',
  styleUrls: ['./sales-edit.component.css'],
})
export class SalesEditComponent implements OnInit {
  venta: any;
  productosDisponibles: any[] = [];
  totalVenta: number = 0;
  productoSeleccionado: { [key: string]: number } = {}; // Para almacenar los productos seleccionados con cantidades
  nuevaFecha: string | null = null;
  productosSeleccionadosResumen: any[] = []; // Para manejar el resumen de los productos seleccionados

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerVenta(id);
      this.obtenerProductosDisponibles();
    }
  }

  obtenerVenta(id: string): void {
    this.saleService.obtenerVentaPorId(id).subscribe({
      next: (venta) => {
        this.venta = venta;
        this.nuevaFecha = venta.fecha;
      },
      error: (error) => {
        console.error('Error al obtener la venta', error);
      },
    });
  }

  obtenerProductosDisponibles(): void {
    this.saleService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productosDisponibles = productos;
      },
      error: (error) => {
        console.error('Error al obtener los productos', error);
      },
    });
  }

  get selectedProductIds(): string[] {
    return Object.keys(this.productoSeleccionado);
  }

  getProductName(productId: string): string {
    const producto = this.productosDisponibles.find((p) => p._id === productId);
    return producto ? producto.nombre : 'Producto desconocido';
  }

  getProductPrice(productId: string): number {
    const producto = this.productosDisponibles.find((p) => p._id === productId);
    return producto ? producto.precio_unitario : 0;
  }

  // Método para eliminar un producto de la venta
  eliminarProducto(producto: any): void {
    this.venta.productos = this.venta.productos.filter(
      (p: { productoId: any }) => p.productoId !== producto.productoId
    );
  }

  // Método para calcular el subtotal de un producto
  calcularSubtotal(productoId: string, cantidad: number): number {
    const precioUnitario = this.getProductPrice(productoId);
    return precioUnitario * cantidad;
  }

  // Actualiza el resumen de cambios y el estado del carrito cuando se marca o desmarca un producto
  actualizarResumen(): void {
    // Filtrar los productos seleccionados para eliminar aquellos con cantidad 0 (desmarcados)
    this.productosSeleccionadosResumen = Object.keys(this.productoSeleccionado)
      .filter((productId) => this.productoSeleccionado[productId] > 0)
      .map((productId) => ({
        productoId: productId,
        cantidad: this.productoSeleccionado[productId],
        precio_unitario: this.getProductPrice(productId),
        subtotal: this.calcularSubtotal(
          productId,
          this.productoSeleccionado[productId]
        ),
      }));

    // Si la cantidad de un producto es 0 o se desmarca, lo eliminamos del resumen
    this.selectedProductIds.forEach((productId) => {
      if (this.productoSeleccionado[productId] === 0) {
        const index = this.productosSeleccionadosResumen.findIndex(
          (p) => p.productoId === productId
        );
        if (index !== -1) {
          this.productosSeleccionadosResumen.splice(index, 1); // Eliminamos el producto del resumen
        }
      }
    });

    // **Actualizar el total después de cada cambio**
    this.totalVenta = this.calcularTotal(); // Recalcular el total cada vez que el resumen cambie
  }

  // Filtrar productos a agregar para mostrarlos en el resumen de cambios
  get selectedProducts(): any[] {
    return this.productosSeleccionadosResumen.map((resumen) => {
      const producto = this.productosDisponibles.find(
        (p) => p._id === resumen.productoId
      );
      return {
        nombre: producto ? producto.nombre : 'Producto desconocido',
        precio: producto ? producto.precio_unitario : 0,
        cantidad: resumen.cantidad,
      };
    });
  }

  // Método para calcular el total actualizado
  calcularTotal(): number {
    let total = 0;

    // Subtotal de los productos actuales
    this.venta.productos.forEach(
      (producto: { productoId: string; cantidad: number }) => {
        total += this.calcularSubtotal(producto.productoId, producto.cantidad);
      }
    );

    // Subtotal de los productos seleccionados (carrito)
    this.productosSeleccionadosResumen.forEach((producto) => {
      total += producto.precio_unitario * producto.cantidad;
    });

    return total;
  }

  // Guardar los cambios de la venta
  // Guardar los cambios de la venta
  guardarVenta(): void {
    // Recalcular el total actualizado antes de guardar
    this.totalVenta = this.calcularTotal(); // Asegúrate de que el total siempre esté actualizado

    // Filtrar los productos seleccionados que tienen una cantidad mayor a 0
    const productosSeleccionadosDetails = Object.keys(this.productoSeleccionado)
      .filter((productId) => this.productoSeleccionado[productId] > 0)
      .map((productId) => ({
        productoId: productId,
        cantidad: this.productoSeleccionado[productId],
        precio_unitario: this.getProductPrice(productId),
        subtotal: this.calcularSubtotal(
          productId,
          this.productoSeleccionado[productId]
        ),
      }));

    // Eliminar productos duplicados (los que ya están en la venta)
    // El filtro garantiza que no se repitan productos entre los que ya existen en la venta y los nuevos productos seleccionados
    const productosUnicos = [
      ...this.venta.productos.filter(
        (producto: { productoId: string }) =>
          !productosSeleccionadosDetails.some(
            (nuevoProducto) => nuevoProducto.productoId === producto.productoId
          )
      ),
      ...productosSeleccionadosDetails,
    ];

    // Crear el objeto de venta con productos actualizados
    const ventaActualizada = {
      ...this.venta,
      total: this.totalVenta, // Asegúrate de incluir el total actualizado
      fecha: this.nuevaFecha || this.venta.fecha, // Mantener la fecha existente o usar la nueva fecha
      productos: productosUnicos, // Actualizar con productos únicos (sin duplicados)
    };

    // Confirmación de los cambios antes de enviar
    Swal.fire({
      title: 'Confirmación de cambios',
      html: `¿Estás seguro de guardar los cambios?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService
          .actualizarVenta(ventaActualizada._id, ventaActualizada)
          .subscribe({
            next: (response) => {
              Swal.fire('¡Éxito!', 'La venta ha sido actualizada.', 'success');
              this.router.navigate(['/home/sales']);
            },
            error: (error) => {
              Swal.fire(
                'Error',
                'Hubo un problema al actualizar la venta.',
                'error'
              );
            },
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.router.navigate(['/home/sales']);
  }
}
