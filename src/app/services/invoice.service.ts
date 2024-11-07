import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Invoice {
  id: number;
  customer: string;
  date: string;
  amount: number;
  pdfUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'https://api.miapp.com/invoices';

  constructor(private http: HttpClient) {}

  searchInvoices(filters: any): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${this.apiUrl}/search`, filters);
  }
}
