import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

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
  categoriaSeleccionada: string = '';
  proveedorSeleccionado: string = '';
  categorias: string[] = [];
  proveedores: string[] = [];

  constructor(private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.categorias = [...new Set(data.map((p) => p.categoria))];  // Extrae categorías únicas
        this.proveedores = [...new Set(data.map((p) => p.proveedor))];  // Extrae proveedores únicos
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  buscarProductos(): void {
    const criterio = this.criterioBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) => {
      const matchNombre = producto.nombre.toLowerCase().includes(criterio);
      const matchCategoria = this.categoriaSeleccionada
        ? producto.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase()
        : true;
      const matchProveedor = this.proveedorSeleccionado
        ? producto.proveedor.toLowerCase() === this.proveedorSeleccionado.toLowerCase()
        : true;

      return (
        (matchNombre || producto.categoria.toLowerCase().includes(criterio) || producto.proveedor.toLowerCase().includes(criterio)) &&
        matchCategoria &&
        matchProveedor
      );
    });
  }

  exportarResultados(): void {
    // Exportar a Excel
    const data = this.productosFiltrados.map((producto) => ({
      Nombre: producto.nombre,
      Precio: producto.precio_unitario,
      Categoría: producto.categoria,
      Proveedor: producto.proveedor,
      Cantidad: producto.cantidad,
    }));

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
        producto.categoria,
        producto.proveedor,
        producto.cantidad,
      ]),
    });
    doc.save('productos.pdf');
  }

  cancelar(): void {
    this.criterioBusqueda = '';
    this.categoriaSeleccionada = '';
    this.proveedorSeleccionado = '';
    this.productosFiltrados = this.productos;
    this.router.navigate(['/home/products']);
  }
}
