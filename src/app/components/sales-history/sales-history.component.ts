import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesHistoryService } from '../../services/sales-history.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css']
})
export class SalesHistoryComponent {
  sales: any[] = [];
  startDate: string = '';
  endDate: string = '';
  productId: number = 0;
  errorMessage: string = '';

  // Uso de `inject` en lugar de `constructor`
  private salesHistoryService = inject(SalesHistoryService);
  private notificationService = inject(NotificationService);

  constructor() {}

  ngOnInit(): void {
    this.fetchSalesHistory();
  }

  fetchSalesHistory(): void {
    this.salesHistoryService.getSalesHistory(this.startDate, this.endDate, this.productId).subscribe(
      (response) => {
        if (response.length === 0) {
          this.errorMessage = 'No se encontraron ventas para los criterios seleccionados.';
        } else {
          this.sales = response;
        }
      },
      (error) => {
        this.notificationService.notifyError('Error al obtener el historial de ventas');
      }
    );
  }

  onFilter(): void {
    this.fetchSalesHistory();  // Filtrar las ventas basadas en los criterios seleccionados
  }
}
