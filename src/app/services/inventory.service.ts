import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface Product {
  id: number;
  name: string;
  code: string;
  quantity: number;
  minThreshold: number;
  alertDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://api.miapp.com/inventory';
  private alertThreshold = 60000; // 60 segundos para el monitoreo continuo (puede ajustarse según necesidad)

  constructor(private http: HttpClient) {}

  monitorStock(): Observable<Product[]> {
    return interval(this.alertThreshold).pipe(
      switchMap(() => this.checkLowStock()),
      catchError(error => {
        console.error('Error al verificar niveles de stock:', error);
        this.logError(error);
        return of([]);
      })
    );
  }

  private checkLowStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`).pipe(
      catchError(error => {
        console.error('Error en la consulta de stock bajo:', error);
        this.logError(error);
        return of([]);
      })
    );
  }

  logError(error: any): void {
    // Lógica para registrar errores en el sistema de logs
    console.error('Log de error:', error);
  }
}
