import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../../services/invoice.service';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Producto {
  productoId: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}


interface Invoice {
  _id: string;
  numero: number;
  fecha: string;
  ventaId: string;
  total: number;
  cliente: string;
  direccion: string;
  ruc: string;
  telefono: string;
  estado: string;
  pdfUrl: string;
  productos: Producto[];
}

@Component({
  selector: 'app-invoice-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-search.component.html',
})
export class InvoiceSearchComponent implements OnInit {
  invoices: Invoice[] = [];
  allInvoices: Invoice[] = []; // Se agregan para guardar todas las facturas
  filters = {
    dateStart: '',
    dateEnd: '',
    customer: '',
    minAmount: 0,
    maxAmount: 0,
    state: '',
  };

  selectedFilter: string = '';
  message: string = '';
  showModal: boolean = false;
  selectedInvoice: Invoice | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices(); // Cargar todas las facturas al inicio
  }

  // Cargar todas las facturas sin filtros
  loadInvoices(): void {
    this.invoiceService.getFacturas().subscribe({
      next: (data) => {
        this.allInvoices = data; // Guardar todas las facturas en allInvoices
        this.invoices = data; // Mostrar todas las facturas inicialmente
        this.message = data.length ? '' : 'No se encontraron facturas';
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        this.message = 'Error al cargar facturas';
      },
    });
  }

  // Aplicar los filtros
  searchInvoices(): void {
    console.log('Búsqueda iniciada');

    // Filtrar las facturas almacenadas en allInvoices
    this.invoices = this.allInvoices.filter((invoice) => {
      let matches = true;

      // Filtrar por fecha de inicio y fecha de fin
      if (this.filters.dateStart || this.filters.dateEnd) {
        const invoiceDate = new Date(invoice.fecha).getTime(); // Convierte la fecha de la factura a timestamp
        const startDate = this.filters.dateStart
          ? new Date(this.filters.dateStart).setHours(0, 0, 0, 0)
          : null; // Convierte la fecha de inicio a timestamp
        const endDate = this.filters.dateEnd
          ? new Date(this.filters.dateEnd).setHours(23, 59, 59, 999)
          : null; // Convierte la fecha de fin a timestamp

        if (startDate) {
          matches = matches && invoiceDate >= startDate; // Comparar con timestamp
        }
        if (endDate) {
          matches = matches && invoiceDate <= endDate; // Comparar con timestamp
        }
      }

      // Filtrar por cliente
      if (this.filters.customer) {
        matches =
          matches &&
          invoice.cliente
            .toLowerCase()
            .includes(this.filters.customer.toLowerCase());
      }

      // Filtrar por monto mínimo
      if (this.filters.minAmount) {
        matches = matches && invoice.total >= this.filters.minAmount;
      }

      // Filtrar por monto máximo
      if (this.filters.maxAmount) {
        matches = matches && invoice.total <= this.filters.maxAmount;
      }

      // Filtrar por estado
      if (this.filters.state) {
        matches =
          matches &&
          invoice.estado.toLowerCase() === this.filters.state.toLowerCase();
      }

      return matches;
    });

    // Mostrar mensaje si no se encontraron resultados
    this.message = this.invoices.length
      ? ''
      : 'No se encontraron facturas con los filtros aplicados.';
  }

  // Limpiar los filtros y mostrar todas las facturas nuevamente
  clearFilters(): void {
    this.filters = {
      dateStart: '',
      dateEnd: '',
      customer: '',
      minAmount: 0,
      maxAmount: 0,
      state: '',
    };
    this.selectedFilter = '';
    this.invoices = this.allInvoices; // Mostrar todas las facturas nuevamente
    this.message = '';
  }

  viewInvoice(id: string): void {
    this.invoiceService.getFacturaById(id).subscribe({
      next: (data) => {
        this.selectedInvoice = data; // Asignar la factura seleccionada
        this.showModal = true; // Cambiar el estado para mostrar el modal
      },
      error: (error) => {
        console.error('Error al cargar la factura:', error);
        this.message = 'Error al cargar la factura seleccionada';
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedInvoice = null;
  }

  // Función para descargar la factura como Excel
  downloadInvoiceAsExcel(): void {
    if (this.selectedInvoice) {
      const invoiceDetails = this.selectedInvoice; // Los detalles de la factura

      // Crear la hoja de trabajo con la información de la factura
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
        {
          'Número de Factura': invoiceDetails.numero,
          Fecha: invoiceDetails.fecha,
          Cliente: invoiceDetails.cliente,
          Total: invoiceDetails.total,
          Dirección: invoiceDetails.direccion,
          RUC: invoiceDetails.ruc,
          Teléfono: invoiceDetails.telefono,
          Estado: invoiceDetails.estado,
        },
      ]);
      // Si tienes productos asociados a la factura, puedes agregar un detalle adicional
      const productos = invoiceDetails.productos.map((producto) => {
        return {
          Producto: producto.productoId,
          Cantidad: producto.cantidad,
          Precio: producto.precio_unitario,
          Total: producto.subtotal * producto.cantidad,
        };
      });
      // Crear una hoja de trabajo para los productos
      const wsProductos: XLSX.WorkSheet = XLSX.utils.json_to_sheet(productos);
      // Crear el libro de trabajo con ambas hojas: una para los detalles y otra para los productos
      const wb: XLSX.WorkBook = {
        Sheets: { Factura: ws, Productos: wsProductos },
        SheetNames: ['Factura', 'Productos'],
      };

      // Convertir el libro de trabajo en un buffer y descargarlo
      const excelBuffer: any = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
      });
      const excelFile = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(excelFile);
      link.download = 'factura.xlsx';
      link.click();
    } else {
      this.message = 'No se pudo generar el archivo Excel de la factura';
      console.error('Factura no encontrada');
    }
  }

  transform(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  onFilterChange(): void {
    // Limpiar los filtros no relacionados
    if (this.selectedFilter !== 'dateStart') this.filters.dateStart = '';
    if (this.selectedFilter !== 'dateEnd') this.filters.dateEnd = '';
    if (this.selectedFilter !== 'customer') this.filters.customer = '';
    if (this.selectedFilter !== 'minAmount') this.filters.minAmount = 0;
    if (this.selectedFilter !== 'maxAmount') this.filters.maxAmount = 0;
    if (this.selectedFilter !== 'state') this.filters.state = '';
  }
}
