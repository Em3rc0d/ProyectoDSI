import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoriesService } from '../../../services/categories.service';
import { SaleService } from '../../../services/sale.service'; // Importando SaleService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {
  isLoading: boolean = true; // Define isLoading
  products: any[] = [];
  productosBajoStock: any[] = [];
  stockUmbral: number = 5;
  contadorBajoStock: number = 0;
  contadorProductos: number = 0;
  contadorCategorias: number = 0;
  contadorVentas: number = 0;
  ultimasVentasProductos: any[] = [];
  ventas: any[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private saleService: SaleService // Injecting SaleService here
  ) {}

  ngOnInit(): void {
    this.totalProductos();
    this.totalCategorias();
    this.totalVentas();
    this.loadSales();
  }

  
  setLoadingState(state: boolean): void {
    this.isLoading = state;
  }

  loadSales() {
    // Obtener las ventas del servicio
    this.saleService.obtenerVentas().subscribe({
      next: (ventas: any[]) => {
        this.ventas = ventas;
      },
      error: (error) => {
        console.error('Error al obtener las ventas', error);
        this.isLoading = false;
      },
    });
  }

  // Fetch the total number of products and their low stock status
  totalProductos() {
    this.setLoadingState(true); // Establecer que los datos están cargando
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.products = data;
        this.contadorProductos = this.products.length;
        this.detectarProductosBajoStock();
        this.setLoadingState(false); // Finaliza la carga
      },
      error: (error) => {
        console.error(error);
        this.setLoadingState(false); // Finaliza la carga si hay error
      },
    });
  }

  // Fetch the total number of categories
  totalCategorias() {
    this.categoriesService.obtenerCategorias().subscribe({
      next: (data) => {
        this.contadorCategorias = data.length;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Fetch total sales count
  totalVentas() {
    this.saleService.obtenerVentas().subscribe({
      next: (data) => {
        this.contadorVentas = data.length;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Detect products that are below stock threshold
  detectarProductosBajoStock(): void {
    this.productosBajoStock = this.products.filter(
      (product) => product.cantidad_stock < this.stockUmbral
    );
    this.contadorBajoStock = this.productosBajoStock.length;
  }
}
