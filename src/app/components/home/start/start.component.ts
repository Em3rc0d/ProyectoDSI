import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoriesService } from '../../../services/categories.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';  // Importar el componente baseChart
import { SaleService } from '../../../services/sale.service';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [BaseChartDirective],  // Importar BaseChartDirective
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {
  products: any[] = [];
  productosBajoStock: any[] = [];
  stockUmbral: number = 5;
  contadorBajoStock: number = 0;
  contadorProductos: number = 0;
  contadorCategorias: number = 0;
  contadorVentas: number = 350;  // Placeholder for today’s sales data

  // Chart.js Data
  public barChartLabels: string[] = [];  // Months
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [],
        label: 'Productos Vendidos',
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };
  public barChartType: ChartType = 'bar';

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.totalProductos();
    this.totalCategorias();
    this.totalVentas();
    this.loadSalesData(); // Load monthly sales data
  }

  // Fetch the total number of products and their low stock status
  totalProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.products = data;  // Store products data
        this.contadorProductos = this.products.length;  // Update total product count
        this.detectarProductosBajoStock();  // Detect low stock after products are fetched
      },
      error: (error) => {
        console.error(error);
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

  totalVentas(){
    this.saleService.obtenerVentas().subscribe({
      next: (data) => {
        this.contadorVentas = data.length;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  // Detect low stock products
  detectarProductosBajoStock(): void {
    this.productosBajoStock = this.products.filter(
      (product) => product.cantidad_stock < this.stockUmbral
    );
    this.contadorBajoStock = this.productosBajoStock.length;
  }

  // Load the sales data (replace this with actual API data)
  loadSalesData() {
    this.barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthlySalesData = [120, 90, 150, 180, 200, 130, 170, 160, 140, 210, 230, 190];
    this.barChartData.datasets[0].data = monthlySalesData;
    console.log('Datos del gráfico de barras:', this.barChartData); // Verifica los datos
  }
  
}
