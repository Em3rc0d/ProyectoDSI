import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css'],
})
export class SalesSearchComponent implements OnInit {
  ventas: any[] = [];
  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
  };

  estados = ['abierta', 'cerrada']; // Los estados de las ventas

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {}

  buscarVentas(): void {
    if (!this.filtros.fechaDesde && !this.filtros.fechaHasta && !this.filtros.estado) {
      // Si no se han ingresado filtros, muestra todas las ventas
      this.saleService.obtenerVentas().subscribe({
        next: (data) => {
          this.ventas = data;
        },
        error: (error) => {
          Swal.fire('Error', 'Hubo un problema al obtener las ventas.', 'error');
        },
      });
    } else {
      // Si se han ingresado filtros, realiza la búsqueda con los filtros aplicados
      this.saleService.buscarVentasFiltradas(this.filtros).subscribe({
        next: (data) => {
          this.ventas = data;
        },
        error: (error) => {
          Swal.fire('Error', 'Hubo un problema al buscar las ventas.', 'error');
        },
      });
    }
  }
}
