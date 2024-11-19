import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { catchError, Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = environment.apiUrl + 'api/ventas';

  constructor(private http: HttpClient, 
    private productService: ProductService) {}

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
    // Asegurémonos de que el cuerpo de la solicitud tenga la estructura correcta
    const body = {
      productos: venta.productos.map((producto: { productoId: any; cantidad: any; precio_unitario: any; subtotal: any; }) => ({
        productoId: producto.productoId,  // Asegúrate de que esto sea un ObjectId
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
        subtotal: producto.subtotal
      }))
    };

    return this.http.put(`${this.apiUrl}/${id}`, body);  // Realizar la petición PUT
  }

  eliminarVenta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarVentasFiltradas(filtros: any): Observable<any[]> {
    let params = new HttpParams();

    // Agregar parámetros solo si tienen valor
    if (filtros.tipoFiltro) {
      params = params.append('tipoFiltro', filtros.tipoFiltro);
    }
    if (filtros.fechaDesde) {
      params = params.append('fechaDesde', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      params = params.append('fechaHasta', filtros.fechaHasta);
    }
    if (filtros.estado) {
      params = params.append('estado', filtros.estado);
    }

    return this.http.get<any[]>(this.apiUrl + '/filter', { params }).pipe(
      catchError((error) => {
        console.error('Error al buscar ventas filtradas', error);
        throw error; // O manejar el error de alguna otra forma
      })
    );
  }

  obtenerProductos(): Observable<any[]> {
    return this.productService.obtenerProductos();
  }
}
