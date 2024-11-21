import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de instalar jwt-decode
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    sessionStorage.setItem('token', credentials.token);
    sessionStorage.setItem('role', credentials.role);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }
  

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }

  logout(): void{
    sessionStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
  // Obtener el rol del usuario desde el localStorage
  getUserRole(): string {
    return sessionStorage.getItem('role') || 'guest'; // Retorna el rol, o 'guest' si no está autenticado
  }
}
