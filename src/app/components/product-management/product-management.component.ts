import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  selectedProduct: Product = { id: 0, name: '', description: '', price: 0, quantity: 0 };
  isEditing: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => (this.products = data),
      (error) => console.error('Error al obtener productos', error)
    );
  }

  searchProducts(): void {
    this.productService.searchProducts(this.searchQuery).subscribe(
      (data) => (this.products = data),
      (error) => console.error('Error en la búsqueda', error)
    );
  }

  addProduct(): void {
    this.productService.addProduct(this.selectedProduct).subscribe(
      () => {
        this.getProducts();
        this.selectedProduct = { id: 0, name: '', description: '', price: 0, quantity: 0 };
      },
      (error) => console.error('Error al agregar producto', error)
    );
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    this.productService.updateProduct(this.selectedProduct).subscribe(
      () => {
        this.getProducts();
        this.isEditing = false;
        this.selectedProduct = { id: 0, name: '', description: '', price: 0, quantity: 0 };
      },
      (error) => console.error('Error al actualizar producto', error)
    );
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => this.getProducts(),
      (error) => console.error('Error al eliminar producto', error)
    );
  }
}
