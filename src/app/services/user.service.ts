import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';  // Para manejar errores

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + 'api/usuarios';

  constructor(private http: HttpClient) {}

  // Método privado para obtener los encabezados con el token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  obtenerUsuarioPorEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/email/${email}`;
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: any) {
    // Se pueden personalizar los mensajes de error dependiendo del tipo de error
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal, por favor inténtelo de nuevo.'));
  }
}
