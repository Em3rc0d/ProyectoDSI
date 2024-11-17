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
    tipoFiltro: '',   // Tipo de filtro seleccionado
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
  };

  estados = ['completada', 'pendiente']; // Los estados de las ventas
  tiposFiltro = ['Fecha', 'Estado'];    // Tipos de filtros disponibles

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {}

  // Esta función se llama cuando el tipo de filtro cambia
  onTipoFiltroChange(): void {
    if (this.filtros.tipoFiltro === 'Fecha') {
      this.filtros.estado = '';  // Limpiar estado cuando se selecciona filtro por fecha
    } else if (this.filtros.tipoFiltro === 'Estado') {
      this.filtros.fechaDesde = '';
      this.filtros.fechaHasta = '';  // Limpiar fechas cuando se selecciona filtro por estado
    }
  }

  // Función para aplicar los filtros
  buscarVentas(): void {
    // Verificar si se selecciona un filtro
    if (this.filtros.tipoFiltro === '') {
      // Si no hay filtro seleccionado, mostrar todas las ventas
      this.saleService.obtenerVentas().subscribe({
        next: (data) => {
          this.ventas = data;
        },
        error: (error) => {
          Swal.fire('Error', 'Hubo un problema al obtener las ventas.', 'error');
        },
      });
    } else {
      // Si hay un filtro seleccionado, aplicar el filtro correspondiente
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
