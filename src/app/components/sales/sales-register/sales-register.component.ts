import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-sales-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-register.component.html',
  styleUrl: './sales-register.component.css',
})
export class SalesRegisterComponent implements OnInit {
  productos: any[] = [];
  venta = {
    cliente: '',
    fecha: '',
    total: 0,
    productos: [
      {
        productoId: '',
        cantidad: 0,
        precio_unitario: 0,
        subtotal: 0,
      },
    ],
  };

  constructor(
    private saleService: SaleService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.establecerFechaPorDefecto();
  }

  establecerFechaPorDefecto(): void {
    const fechaActual = new Date();
    const offsetPeru = -5; // UTC-5
    const peruTimezone = new Date(fechaActual.getTime() + offsetPeru * 60 * 60 * 1000);
    
    // Formatear la fecha y hora en el formato necesario
    const fechaConHora = peruTimezone.toISOString().split('T');
    const fecha = fechaConHora[0]; // 'yyyy-mm-dd'
    const hora = fechaConHora[1].substring(0, 5); // 'hh:mm'
  
    // Establecer tanto la fecha como la hora en el campo correspondiente
    this.venta.fecha = `${fecha}T${hora}`;
  }
  
  
  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  registrarVenta() {
    this.saleService.crearVenta(this.venta).subscribe({
      next: (data) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Venta registrada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al registrar la venta. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  calcularSubtotal(): number {
    const productoSeleccionado = this.productos.find(
      (producto) => producto._id === this.venta.productos[0].productoId
    );
    if (productoSeleccionado) {
      const precio = productoSeleccionado.precio_unitario;
      const cantidad = this.venta.productos[0].cantidad || 1;
      return precio * cantidad;
    }
    return 0;
  }

  cancelar() {
    this.venta = {
      cliente: '',
      fecha: '',
      total: 0,
      productos: [
        {
          productoId: '',
          cantidad: 0,
          precio_unitario: 0,
          subtotal: 0,
        },
      ],
    };
    this.router.navigate(['/sales']);
  }
}
