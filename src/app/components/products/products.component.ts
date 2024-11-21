import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriesService } from '../../services/categories.service';
import { ProvidersService } from '../../services/providers.service';

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
  isModalVisible: boolean = false; // Controlar la visibilidad del modal
  selectedProduct: any = {}; // Producto seleccionado para editar
  categories: any[] = [];
  providers: any[] = [];

  constructor(private productService: ProductService,
    private categoriesService: CategoriesService,
    private providersService: ProvidersService
  ) {}

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
          (product) => `• ${product.nombre} (Stock: ${product.cantidad_stock})`
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

  // Mostrar el modal con el producto a editar y cargar categorías y proveedores
  editProduct(id: string, product: any): void {
    this.selectedProduct = { ...product }; // Copiar el producto seleccionado
    this.isModalVisible = true; // Mostrar el modal
  }

   // Actualizar el producto
   updateProduct(): void {
    this.productService.actualizarProducto(this.selectedProduct._id, this.selectedProduct).subscribe({
      next: (data) => {
        console.log('Producto actualizado con éxito:', data);
        this.loadProducts();
        this.closeModal(); // Cerrar el modal después de actualizar
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  // Cerrar el modal
  closeModal(): void {
    this.isModalVisible = false;
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
