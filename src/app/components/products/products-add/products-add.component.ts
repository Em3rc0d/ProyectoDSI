import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Producto {
  _id: string;
  nombre: string;
  precio_unitario: number;
  cantidad_stock: number;
  categoria: string;
  proveedor: string;
}

@Component({
  selector: 'app-products-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.css']
})
export class ProductsAddComponent implements OnInit {
  products: Producto[] = [];
  productSelected: Producto | null = null;
  cantidad: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  agregarProducto(producto: Producto | null): void {
    if (producto !== null) {
      this.productSelected = producto;
      this.cantidad = 1;  // Resetear la cantidad a 1 por defecto
    }
  }

  agregarInventario(): void {
    if (this.productSelected && this.cantidad > 0) {
      const productoActualizado = { ...this.productSelected };
      productoActualizado.cantidad_stock += this.cantidad;

      this.productService.actualizarProducto(productoActualizado._id, productoActualizado).subscribe({
        next: (data) => {
          // Mostrar un mensaje de éxito usando Swal
          Swal.fire({
            title: 'Éxito',
            text: 'El inventario ha sido actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/home/products']);
        },
        error: (error) => {
          // Mostrar un mensaje de error si algo falla
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar el inventario. Por favor, intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al actualizar inventario:', error);
        },
      });
    }
  }
}
