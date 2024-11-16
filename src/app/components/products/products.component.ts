import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  productosBajoStock: any[] = [];
  stockUmbral: number = 5; // Umbral de bajo stock

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.products = data;
        this.detectarProductosBajoStock();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  detectarProductosBajoStock(): void {
    this.productosBajoStock = this.products.filter(
      (product) => product.cantidad_stock < this.stockUmbral
    );
  }

  mostrarProductosBajoStock(): void {
    if (this.productosBajoStock.length > 0) {
      const productos = this.productosBajoStock
        .map(
          (product) =>
            `• ${product.nombre} (Stock: ${product.cantidad_stock})`
        )
        .join('<br>');

      Swal.fire({
        title: 'Productos con Bajo Stock',
        html: productos,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    } else {
      Swal.fire({
        title: 'Sin Alertas',
        text: 'No hay productos con bajo stock.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  editProduct(id: string, product: any): void {
    this.productService.actualizarProducto(id, product).subscribe({
      next: (data) => {
        console.log(data);
        this.loadProducts();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteProduct(id: string): void {
    this.productService.eliminarProducto(id).subscribe({
      next: (data) => {
        console.log(data);
        this.loadProducts();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
