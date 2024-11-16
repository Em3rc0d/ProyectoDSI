import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private apiUrl = environment.apiUrl + 'api/proveedores';
  constructor(private httpClient: HttpClient) {}

  obtenerProveedores(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  
  crearProveedor(proveedor: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, proveedor);
  }
}
