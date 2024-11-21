import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';

interface Producto {
  productoId: string;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  producto = {
    _id: '',
    nombre: '',
    precio_unitario: 0,
    cantidad_stock: 0,
    categoria: '',
    proveedor: '',
  };

  venta: any = {
    ventaId: '',
    cliente: '',
    direccion: '',
    ruc: '',
    telefono: '',
    productos: [] as Producto[],
    total: 0,
  };

  factura: any = {
    numero: '',
    fecha: new Date(),
    ventaId: '',
    total: 0,
    cliente: '',
    direccion: '',
    ruc: '',
    telefono: '',
    estado: 'emitida',
    productos: [] as Producto[],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: InvoiceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la venta a través de la URL
    this.route.queryParams.subscribe((params) => {
      this.venta.ventaId = params['ventaId'];
      this.venta.cliente = params['cliente'] || '';
      this.venta.direccion = params['direccion'] || '';
      this.venta.fecha = params['fecha'] || '';
      this.venta.ruc = params['ruc'] || '';
      this.venta.telefono = params['telefono'] || '';
      this.venta.productos = JSON.parse(params['productos'] || '[]');
      this.venta.total = params['total'] || 0;

      // Rellenar la factura con los datos de la venta
      this.factura.ventaId = this.venta.ventaId;
      this.factura.cliente = this.venta.cliente;
      this.factura.direccion = this.venta.direccion;
      this.factura.fecha = this.venta.fecha;
      this.factura.ruc = this.venta.ruc;
      this.factura.telefono = this.venta.telefono;
      this.factura.productos = this.venta.productos;
      this.factura.total = this.venta.total;

      console.log(this.factura.ventaId)
    });
  }

  // Método para cargar el producto por su ID y asignar el stock correspondiente
  cargarProductos(productoId: string): void {
    this.productService.obtenerProductoPorId(productoId).subscribe({
      next: (data) => {
        const productoEncontrado = this.factura.productos.find(
          (p: { productoId: string }) => p.productoId === productoId
        );
        if (productoEncontrado) {
          productoEncontrado.cantidad_stock = data.cantidad_stock;
        }
      },
      error: (error) => {
        console.error('Error al cargar el producto:', error);
      },
    });
  }

  // Método para verificar el stock de un producto
  cargarStock(productoId: string): string {
    const producto = this.factura.productos.find(
      (p: { productoId: string }) => p.productoId === productoId
    );

    if (producto) {
      if (producto.cantidad_stock !== undefined) {
        return producto.cantidad_stock.toString();
      } else {
        this.cargarProductos(productoId); // Cargar el stock si no está disponible
        return 'Cargando...';
      }
    }
    return 'No disponible';
  }

  // Método para registrar la factura
  registrarFactura(): void {
    const facturaData = {
      ...this.factura,
      numero: this.generarNumeroFactura(),
      fecha: new Date(),
    };
  
    // Asegúrate de que los campos requeridos estén presentes
    if (!facturaData.ventaId || !facturaData.cliente || !facturaData.direccion || !facturaData.ruc || !facturaData.telefono) {
      Swal.fire({
        title: 'Error',
        text: 'Faltan datos requeridos.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  
    console.log(facturaData); // Verifica si los datos están correctos
  
    this.facturaService.createFactura(facturaData).subscribe(
      (res) => {
        Swal.fire({
          title: '¡Factura registrada con éxito!',
          text: `Número de factura: ${facturaData.numero}`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/home/sales']);
        });
      },
      (err) => {
        console.error('Error en la creación de factura:', err);
        Swal.fire({
          title: 'Error al registrar la factura',
          text: 'Hubo un problema al registrar la factura. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
  

  // Generar un número único para la factura
  generarNumeroFactura(): string {
    return `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  }

  // Método para cancelar y regresar a la lista de ventas
  cancelar(): void {
    this.router.navigate(['/home/sales-register'], {
      queryParams: {
        cliente: this.venta.cliente,
        fecha: this.venta.fecha,
        productos: JSON.stringify(this.venta.productos),
        total: this.venta.total,
      },
    });
  }
}
