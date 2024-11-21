import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Venta {
  cliente: string;
  fecha: string;
  estado: string;
  productos: string[];
  total: number;
}

interface Producto {
  cantidad: number;
  precio_unitario: number;
  productoId: {
    _id: string;
    nombre: string;
    precio_unitario: number;
  };
  subtotal: number;
  _id: string;
}

@Component({
  selector: 'app-sales-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css'],
})
export class SalesSearchComponent implements OnInit {
  ventas: any[] = [];
  filtros = {
    tipoFiltro: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    cliente: '',
    totalDesde: null,
    totalHasta: null,
  };

  estados = ['completada', 'pendiente'];
  tiposFiltro = ['Fecha', 'Estado', 'Cliente', 'Total'];

  // Variables para el modal
  modalVisibleProductos: boolean = false;
  modalVisibleMensaje: boolean = false;
  modalMessage: string = '';
  productosModal: string[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  onTipoFiltroChange(): void {
    switch (this.filtros.tipoFiltro) {
      case 'Fecha':
        this.filtros.estado = '';
        break;
      case 'Estado':
        this.filtros.fechaDesde = '';
        this.filtros.fechaHasta = '';
        break;
      case 'Cliente':
        this.filtros.cliente = '';
        break;
      case 'Total':
        this.filtros.totalDesde = null;
        this.filtros.totalHasta = null;
        break;
      default:
        break;
    }
  }

  buscarVentas(): void {
    if (!this.filtros.tipoFiltro) {
      // Mostrar el modal con un mensaje si no se seleccionó filtro
      this.modalMessage = 'Por favor, ingresa un tipo de filtro para realizar la búsqueda.';
      this.modalVisibleMensaje = true;
      return; // Salir de la función si no hay filtro seleccionado
    }

    this.saleService.buscarVentasFiltradas(this.filtros).subscribe(
      (ventas) => {
        this.ventas = ventas.length ? ventas : [];
      },
      (error) => console.error('Error al buscar ventas:', error)
    );
  }

  verTodasLasVentas(): void {
    this.filtros = {
      tipoFiltro: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      cliente: '',
      totalDesde: null,
      totalHasta: null,
    };
    this.obtenerVentas();
  }

  exportarVenta(venta: any): void {
    const ventaConProductos = {
      ...venta,
      productos: venta.productos.map((producto: Producto) => `${producto.productoId.nombre} (Cantidad: ${producto.cantidad}, Precio Unitario: ${producto.precio_unitario})`).join(', ') 
    };
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([ventaConProductos]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, 'venta.xlsx');
  }
  

  // Funciones para el modal
abrirModalProductos(productos: any[]): void {
  this.productosModal = productos.map((producto: Producto) => `${producto.productoId.nombre} (Cantidad: ${producto.cantidad}, Precio Unitario: ${producto.precio_unitario})`);
  this.modalVisibleProductos = true;
}


  cerrarModalMensaje(): void {
    this.modalVisibleMensaje = false;
    this.modalMessage = '';
  }

  cerrarModalProductos(): void {
    this.modalVisibleProductos = false;
    this.productosModal = [];
  }

  obtenerVentas(): void {
    this.saleService.obtenerVentas().subscribe(
      (ventas) => {
        this.ventas = ventas;
      },
      (error) => console.error('Error al obtener ventas:', error)
    );
  }

  obtenerProductos(venta: any): string[] {
    return venta.productos;
  }
}
