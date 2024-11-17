import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  venta: any = {
    cliente: '',
    direccion: '',
    ruc: '',
    telefono: '',
    productos: [] as Producto[],
    total: 0
  };

  factura: any = {
    numero: '',
    fecha: new Date(),
    total: 0,
    cliente: '',
    direccion: '',
    ruc: '',
    telefono: '',
    productos: [] as Producto[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: InvoiceService
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la venta a través de la URL
    this.route.queryParams.subscribe((params) => {
      this.venta.cliente = params['cliente'] || '';
      this.venta.direccion = params['direccion'] || '';
      this.venta.fecha = params['fecha'] || '';
      this.venta.ruc = params['ruc'] || '';
      this.venta.telefono = params['telefono'] || '';
      this.venta.productos = JSON.parse(params['productos'] || '[]');
      this.venta.total = params['total'] || 0;

      // Rellenar la factura con los datos de la venta
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
    const facturaData = { ...this.factura, fecha: new Date() };

    this.facturaService.createFactura(facturaData).subscribe(
      (res) => {
        alert('Factura registrada con éxito');
        this.router.navigate(['/home/invoices']); // Redirigir a la lista de facturas
      },
      (err) => {
        alert('Hubo un error al registrar la factura');
      }
    );
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
