import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

interface Product {
  id: number;
  name: string;
  code: string;
  quantity: number;
  minThreshold: number;
  alertDate: Date;
}

@Component({
  selector: 'app-low-inventory-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './low-inventory-report.component.html'
})
export class LowInventoryReportComponent implements OnInit {
  lowStockProducts: Product[] = [];
  message: string = '';

  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.inventoryService.monitorStock().subscribe({
      next: (products) => {
        if (products.length) {
          this.lowStockProducts = products;
          this.message = '';
          // Notifica al administrador que hay productos en bajo inventario
          this.notificationService.notifyLowStock();
        } else {
          this.message = 'No hay productos con inventario bajo en este momento.';
        }
      },
      error: (error) => {
        console.error('Error al monitorear el stock:', error);
        this.notificationService.notifyError('Error al verificar el stock. Por favor, intenta más tarde.');
      }
    });
  }

  downloadReport(format: 'pdf' | 'excel'): void {
    // Lógica para descargar el informe en PDF o Excel
    console.log(`Descargando informe en formato ${format}`);
  }
}