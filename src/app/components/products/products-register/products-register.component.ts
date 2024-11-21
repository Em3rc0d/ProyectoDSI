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
  styleUrls: ['./products-register.component.css'], // Arreglado el typo
})
export class ProductsRegisterComponent implements OnInit {
  producto = {
    _id: '',
    nombre: '',
    precio_unitario: 0,
    cantidad_stock: 0,
    categoria: '',
    proveedor: '',
  };

  categories: any[] = [];
  providers: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoriesService: CategoriesService,
    private providersService: ProvidersService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();
  }

  registrarProducto(): void {
    if (!this.validarCampos()) return;

    this.productService.crearProducto(this.producto).subscribe({
      next: (data) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto registrado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.router.navigate(['/home/products']);
      },
      error: (error) => {
        this.manejarError(error);
      },
    });
  }

  validarCampos(): boolean {
    if (!this.producto.nombre) {
      Swal.fire('Advertencia', 'El nombre del producto es obligatorio.', 'warning');
      return false;
    }
    if (!this.producto.precio_unitario || this.producto.precio_unitario <= 0) {
      Swal.fire('Advertencia', 'Por favor, ingresa un precio válido.', 'warning');
      return false;
    }
    if (!this.producto.categoria) {
      Swal.fire('Advertencia', 'Selecciona una categoría válida.', 'warning');
      return false;
    }
    if (!this.producto.proveedor) {
      Swal.fire('Advertencia', 'Selecciona un proveedor válido.', 'warning');
      return false;
    }
    if (this.producto.cantidad_stock < 0) {
      Swal.fire('Advertencia', 'La cantidad de stock no puede ser negativa.', 'warning');
      return false;
    }
    return true;
  }

  manejarError(error: any): void {
    if (error.status === 400) {
      Swal.fire('Error de validación', 'Verifica los datos ingresados.', 'error');
    } else if (error.status === 500) {
      Swal.fire('Error en el servidor', 'Hubo un problema interno. Inténtalo más tarde.', 'error');
    } else if (error.status === 0) {
      Swal.fire('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
    } else {
      Swal.fire('Error desconocido', 'Hubo un problema. Inténtalo nuevamente.', 'error');
    }
    console.error('Error de backend:', error);
  }

  cancelar(): void {
    this.producto = {
      _id: '',
      nombre: '',
      precio_unitario: 0,
      categoria: '',
      proveedor: '',
      cantidad_stock: 0,
    };
    this.router.navigate(['/home/products']);
  }

  cargarCategorias(): void {
    this.categoriesService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }

  cargarProveedores(): void {
    this.providersService.obtenerProveedores().subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      },
    });
  }
}
