import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesHistoryService {
  private apiUrl = 'http://localhost:3000/sales-history';

  constructor(private http: HttpClient) {}

  // Obtener historial de ventas con filtros
  getSalesHistory(startDate: string, endDate: string, productId: number): Observable<any[]> {
    let params = new HttpParams();
    
    // Solo agregar parámetros si tienen un valor
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (productId) params = params.set('productId', productId.toString());  // Asegúrate de convertir a string

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
