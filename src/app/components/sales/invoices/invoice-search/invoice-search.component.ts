import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../../services/invoice.service';

interface Producto {
  productoId: string;
  nombre: string;
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
        this.selectedInvoice = data;
        this.showModal = true;
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

  downloadInvoice(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
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
