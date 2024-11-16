import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = environment.apiUrl + 'api/ventas';

  constructor(private http: HttpClient) { }

  obtenerVentas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, venta);
  }

  obtenerVentaPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  actualizarVenta(id: string, venta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, venta);
  }

  eliminarVenta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarVentasFiltradas(filtros: any): Observable<any[]> {
    const params = {
      fechaDesde: filtros.fechaDesde,
      fechaHasta: filtros.fechaHasta,
      estado: filtros.estado,
    };
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
