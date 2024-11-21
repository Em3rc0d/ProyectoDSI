import { Injectable } from '@angular/core';
import { environment } from './environment';
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
  

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Método para manejar errores
  private handleError(error: any) {
    // Se pueden personalizar los mensajes de error dependiendo del tipo de error
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal, por favor inténtelo de nuevo.'));
  }
}