import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
    private facturaService: InvoiceService
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
      this.factura.ventaId = this.venta.ventaId
      this.factura.cliente = this.venta.cliente;
      this.factura.direccion = this.venta.direccion;
      this.factura.fecha = this.venta.fecha;
      this.factura.ruc = this.venta.ruc;
      this.factura.telefono = this.venta.telefono;
      this.factura.productos = this.venta.productos;
      this.factura.total = this.venta.total;
    });
  }

  // Método para registrar la factura
  registrarFactura(): void {
    const facturaData = {
      ...this.factura,
      numero: this.generarNumeroFactura(),
      fecha: new Date(),
    };
  
    console.log(facturaData); // Verifica si los datos están correctos
  
    this.facturaService.createFactura(facturaData).subscribe(
      (res) => {
        // Mostrar modal de éxito con SweetAlert
        Swal.fire({
          title: '¡Factura registrada con éxito!',
          text: `Número de factura: ${facturaData.numero}`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/home/sales']); // Redirige después de confirmar
        });
      },
      (err) => {
        // Mostrar modal de error con SweetAlert
        Swal.fire({
          title: 'Error al registrar la factura',
          text: 'Hubo un problema al registrar la factura. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
  

  generarNumeroFactura(): string {
    // Generar un número de factura único, por ejemplo, usando la fecha actual y un contador
    return `FAC-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 10000
    )}`;
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
