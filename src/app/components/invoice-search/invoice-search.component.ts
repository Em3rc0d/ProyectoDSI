import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';

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

  searchInvoices(): void {
    this.invoiceService.searchInvoices(this.filters).subscribe(
      (data) => {
        this.invoices = data;
        this.message = data.length ? '' : 'No se encontraron facturas';
      },
      (error) => console.error('Error en la búsqueda de facturas', error)
    );
  }

  viewInvoice(invoice: Invoice): void {
    // Aquí podrías implementar la lógica para mostrar detalles adicionales
    console.log('Detalles de la factura seleccionada:', invoice);
  }

  downloadInvoice(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }

  clearFilters(): void {
    this.filters = { date: '', customer: '', minAmount: 0, maxAmount: 0 };
    this.invoices = [];
    this.message = '';
  }
}
