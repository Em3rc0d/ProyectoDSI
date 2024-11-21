import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl + 'api/categorias';
  constructor(private httpClient: HttpClient) {}
  private headers = this.getHeaders();
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token en los encabezados
    });
  }
  obtenerCategorias(): Observable<any[]> {
    
    return this.httpClient.get<any[]>(this.apiUrl, { headers: this.headers });
  }

  crearCategoria(categoria: any): Observable<any> {

    return this.httpClient.post<any>(this.apiUrl, categoria, {headers: this.headers});
  }
}
