import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { catchError, Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = environment.apiUrl + 'api/ventas';

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
    });
  }
  obtenerVentas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, venta, {
      headers: this.getHeaders(),
    });
  }

  obtenerVentaPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  actualizarVenta(id: string, venta: any): Observable<any> {
    // Asegurémonos de que el cuerpo de la solicitud tenga la estructura correcta
    const body = {
      productos: venta.productos.map(
        (producto: {
          nombre: string;
          productoId: any;
          cantidad: any;
          precio_unitario: any;
          subtotal: any;
        }) => ({
          nombre: producto.nombre,
          productoId: producto.productoId, // Asegúrate de que esto sea un ObjectId
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
          subtotal: producto.subtotal,
        })
      ),
    };

    return this.http.put(`${this.apiUrl}/${id}`, body, {
      headers: this.getHeaders(),
    }); // Realizar la petición PUT
  }

  eliminarVenta(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
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
    if (filtros.cliente) {
      params = params.append('cliente', filtros.cliente);
    }
    if (filtros.totalDesde) {
      params = params.append('totalDesde', filtros.totalDesde);
    }
    if (filtros.totalHasta) {
      params = params.append('totalHasta', filtros.totalHasta);
    }

    return this.http
      .get<any[]>(this.apiUrl + '/filter', {
        params,
        headers: this.getHeaders(),
      })
      .pipe(
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
