import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-search.component.html',
  styleUrl: './products-search.component.css',
})
export class ProductsSearchComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  criterioBusqueda: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Mostrar todos inicialmente
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  buscarProductos(): void {
    const criterio = this.criterioBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(criterio) ||
        producto.categoria.nombre.toLowerCase().includes(criterio) ||
        producto.proveedor.nombre.toLowerCase().includes(criterio)
    );
  }

  exportarResultados(): void {
    const data = this.productosFiltrados.map((producto) => ({
      Nombre: producto.nombre,
      Precio: producto.precio,
      Categoría: producto.categoria.nombre,
      Proveedor: producto.proveedor.nombre,
      Cantidad: producto.cantidad,
    }));

    // Formato por defecto: CSV
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Nombre', 'Precio', 'Categoría', 'Proveedor', 'Cantidad']],
      body: this.productosFiltrados.map((producto) => [
        producto.nombre,
        producto.precio,
        producto.categoria.nombre,
        producto.proveedor.nombre,
        producto.cantidad,
      ]),
    });
    doc.save('productos.pdf');
  }
}
