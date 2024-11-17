import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoriesService } from '../../../services/categories.service';
import { ProvidersService } from '../../../services/providers.service';

@Component({
  selector: 'app-product-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-register.component.html',
  styleUrl: './products-register.component.css',
})
export class ProductRegisterComponent implements OnInit {
  producto = {
    nombre: '',
    precio_unitario: 0,
    cantidad_stock: 0,
    categoria: '',
    proveedor: ''
  };

  categories: any[] = [];
  providers: any[] = [];

  constructor(private productService: ProductService, 
    private router: Router, 
    private categoriesService: CategoriesService,
    private providersService: ProvidersService  
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();
  }

  registrarProducto(): void {
    if (this.producto.nombre && this.producto.precio_unitario > 0 && this.producto.categoria) {
      this.productService.crearProducto(this.producto).subscribe({
        next: (data) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Producto registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al registrar el producto. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, completa los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  cancelar(): void {
    this.producto = {
      nombre: '',
      precio_unitario: 0,
      categoria: '',
      proveedor: '',
      cantidad_stock: 0,
    };
    this.router.navigate(['/products']); // Redirigir al listado de productos
  }

  cargarCategorias(): void {
    this.categoriesService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  cargarProveedores(): void {
    this.providersService.obtenerProveedores().subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
