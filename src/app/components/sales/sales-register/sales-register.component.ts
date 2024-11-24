import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

interface Producto {
  nombre: string;
  productoId: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-sales-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-register.component.html',
  styleUrl: './sales-register.component.css',
})
export class SalesRegisterComponent implements OnInit {
  productos: any[] = []; // Lista de productos disponibles
  venta = {
    cliente: '',
    fecha: '',
    estado: 'completada',
    total: 0, // Total calculado automáticamente
    productos: [] as Producto[], // Ahora el array es de tipo Producto
  };

  productoSeleccionadoId: string = ''; // Declaramos la propiedad para el ID del producto seleccionado
  cantidadSeleccionada: number = 1; // Declaramos la propiedad para la cantidad seleccionada

  constructor(
    private saleService: SaleService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.establecerFechaPorDefecto();
  }

  // Establecer la fecha y hora por defecto en el formato correcto
  establecerFechaPorDefecto(): void {
    const fechaActual = new Date();
    const offsetPeru = -5; // UTC-5
    const peruTimezone = new Date(
      fechaActual.getTime() + offsetPeru * 60 * 60 * 1000
    );
    const fechaConHora = peruTimezone.toISOString().split('T');
    const fecha = fechaConHora[0]; // 'yyyy-mm-dd'
    const hora = fechaConHora[1].substring(0, 5); // 'hh:mm'
    this.venta.fecha = `${fecha}T${hora}`;
  }

  cargarStock(productoId: string): string {
    const producto = this.productos.find((p) => p._id === productoId);
    return producto ? producto.cantidad_stock.toString() : '0';
  }

  // Cargar los productos desde el servicio
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

  // Añadir un producto al carrito
  agregarProducto(productoId: string, cantidad: number): void {
    // Obtener el stock disponible del producto
    const producto = this.productos.find((p) => p._id === productoId);

    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }

    const stockDisponible = producto.cantidad_stock;

    // Verificar si la cantidad solicitada excede el stock disponible
    if (cantidad > stockDisponible) {
      Swal.fire({
        title: 'Error',
        text: `No puedes agregar más de ${stockDisponible} unidades de este producto al carrito.`,
        icon: 'error',
      });
      return;
    }

    // Buscar el producto en el carrito
    const productoEnCarrito = this.venta.productos.find(
      (p) => p.productoId === productoId
    );

    // Verificar si la cantidad total (ya en el carrito + la nueva) excede el stock
    if (productoEnCarrito) {
      const cantidadTotal = productoEnCarrito.cantidad + cantidad;
      if (cantidadTotal > stockDisponible) {
        Swal.fire({
          title: 'Error',
          text: `No puedes agregar más de ${stockDisponible} unidades de este producto al carrito.`,
          icon: 'error',
        });
        return;
      }
      // Si la cantidad total no excede el stock, incrementar la cantidad y actualizar el subtotal
      productoEnCarrito.cantidad += cantidad;
      productoEnCarrito.subtotal =
        productoEnCarrito.precio_unitario * productoEnCarrito.cantidad;
    } else {
      // Si el producto no está en el carrito, agregarlo
      const item: Producto = {
        productoId: producto._id,
        nombre: producto.nombre,
        precio_unitario: producto.precio_unitario,
        cantidad,
        subtotal: producto.precio_unitario * cantidad,
      };
      this.venta.productos.push(item); // Agregar el producto al carrito
    }

    // Actualizar el total de la venta
    this.actualizarTotal();

    // Restablecer la cantidad seleccionada a 1
    this.cantidadSeleccionada = 1;
  }

  // Calcular el total de la venta
  actualizarTotal() {
    this.venta.total = this.venta.productos.reduce((total, producto) => {
      return total + producto.subtotal; // No habrá error aquí
    }, 0);
  }

  // Eliminar un producto del carrito
  eliminarProducto(index: number) {
    this.venta.productos.splice(index, 1);
    this.actualizarTotal();
  }

  // Registrar la venta
  // Registrar la venta y mostrar la confirmación para generar la factura
  registrarVenta() {
    console.log(this.venta);
    this.saleService.crearVenta(this.venta).subscribe({
      next: (data) => {
        // Mostrar alerta de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'Venta registrada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Preguntar si desea generar la factura
            Swal.fire({
              title: '¿Desea generar la factura?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              cancelButtonText: 'No',
            }).then((res) => {
              if (res.isConfirmed) {
                // Si elige Sí, navegar a la página de facturas con la información necesaria
                this.generarFactura(data.venta._id); // Pasa la ventaId y otra información
              } else {
                // Si elige No, redirigir a la página de ventas
                this.router.navigate(['/home/sales']);
              }
            });
          }
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

  // Cancelar la venta y limpiar el carrito
  cancelar() {
    this.venta = {
      cliente: '',
      fecha: '',
      estado: '',
      total: 0,
      productos: [],
    };
    this.router.navigate(['/home/sales']);
  }

  // Método para generar la factura y navegar a la página de facturación
  generarFactura(ventaId: string): void {
    console.log('Generando factura para ventaId:', ventaId);
    const productos = this.venta.productos;
    const cliente = this.venta.cliente;
    const fecha = this.venta.fecha;
    const total = this.venta.total;

    this.router.navigate(['/home/invoices'], {
      queryParams: {
        ventaId: ventaId, // Añadido ventaId
        productos: JSON.stringify(productos),
        cliente: cliente,
        fecha: fecha,
        total: total,
      },
    });
  }
}