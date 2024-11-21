import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private apiUrl = environment.apiUrl + 'api/proveedores';
  constructor(private httpClient: HttpClient) {}
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token en los encabezados
    });
  }

  obtenerProveedores(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  crearProveedor(proveedor: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, proveedor, { headers: this.getHeaders() });
  }
}
