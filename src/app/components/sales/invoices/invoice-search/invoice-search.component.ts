import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../../services/invoice.service';

interface Invoice {
  id: number;
  customer: string;
  date: string;
  amount: number;
  pdfUrl: string;
}

@Component({
  selector: 'app-invoice-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-search.component.html',
})
export class InvoiceSearchComponent implements OnInit {
  invoices: Invoice[] = [];
  filters = {
    date: '',
    customer: '',
    minAmount: 0,
    maxAmount: 0,
  };
  message: string = '';

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {}

  // Load invoices from the service
  loadInvoices(): void {
    this.invoiceService.getFacturas().subscribe(
      (data) => {
        this.invoices = data;
        this.message = data.length ? '' : 'No se encontraron facturas';
      },
      (error) => {
        console.error('Error al obtener las facturas', error);
        this.message = 'Error al obtener las facturas';
      }
    );
  }

  // Search invoices based on filters
  searchInvoices(): void {
    this.invoiceService.searchInvoices(this.filters).subscribe(
      (data) => {
        this.invoices = data;
        this.message = data.length ? '' : 'No se encontraron facturas con los filtros seleccionados';
      },
      (error) => {
        console.error('Error al realizar la búsqueda', error);
        this.message = 'Error al realizar la búsqueda';
      }
    );
  }

  // View invoice details
  viewInvoice(invoice: Invoice): void {
    console.log('Detalles de la factura seleccionada:', invoice);
  }

  // Download invoice PDF
  downloadInvoice(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }

  // Clear all filters and reset state
  clearFilters(): void {
    this.filters = { date: '', customer: '', minAmount: 0, maxAmount: 0 };
    this.invoices = [];
    this.message = '';
  }
}
