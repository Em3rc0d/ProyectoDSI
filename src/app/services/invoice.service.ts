import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

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
  private apiUrl = environment.apiUrl + 'api/facturas';

  constructor(private http: HttpClient) {}

  // Obtener todas las facturas
  getFacturas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener una factura por ID
  getFacturaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva factura
  createFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }

  // Actualizar una factura existente
  updateFactura(id: string, factura: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, factura);
  }

  // Eliminar una factura
  deleteFactura(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchInvoices(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search`, filters);
  }
}
