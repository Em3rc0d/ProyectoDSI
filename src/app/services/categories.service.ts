import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl + 'api/categorias';
  constructor(private httpClient: HttpClient) {}

  obtenerCategorias(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  crearCategoria(categoria: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, categoria);
  }
}
