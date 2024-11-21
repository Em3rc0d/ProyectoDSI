import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + 'api/productos'; // Cambia a tu URL base si es necesario

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token en los encabezados
    });
  }

  // Obtener todos los productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Crear o actualizar un producto (incrementar stock si ya existe)
  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un producto por ID
  obtenerProductoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar un producto por ID
  actualizarProducto(id: string, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Eliminar un producto por ID
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error en la solicitud';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}. Mensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
