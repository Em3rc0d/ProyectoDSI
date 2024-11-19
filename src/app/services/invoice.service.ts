import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = environment.apiUrl + 'api/facturas';

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getFacturaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura).pipe(
      catchError((error) => {
        console.error('Error en la creación de factura:', error);
        return throwError(error); // O devolver un Observable vacío
      })
    );
  }

  updateFactura(id: string, factura: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, factura).pipe(
      catchError(this.handleError)
    );
  }

  deleteFactura(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchInvoices(
    fechaInicio?: string, 
    fechaFin?: string, 
    cliente?: string, 
    montoMinimo?: number, 
    montoMaximo?: number, 
    estado?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (cliente) {
      params = params.set('cliente', cliente);
    }
    if (montoMinimo) {
      params = params.set('montoMinimo', montoMinimo.toString());
    }
    if (montoMaximo) {
      params = params.set('montoMaximo', montoMaximo.toString());
    }
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get(this.apiUrl, { params });
  }

  private handleError(error: any) {
    console.error('Error en el servicio de facturas', error);
    return throwError(() => new Error(error.message || 'Error en el servicio'));
  }
}
