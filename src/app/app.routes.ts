import { Routes } from '@angular/router';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { InvoiceSearchComponent } from './components/invoice-search/invoice-search.component';
import { LowInventoryReportComponent } from './components/low-inventory-report/low-inventory-report.component';
import { SalesManagementComponent } from './components/sales-management/sales-management.component';
import { SalesHistoryComponent } from './components/sales-history/sales-history.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'product-management',
        component: ProductManagementComponent
    },
    {
        path: 'invoice-search',
        component: InvoiceSearchComponent
    },
    {
        path: 'inventory-report',
        component: LowInventoryReportComponent
    },
    {
        path: 'sales-management',
        component: SalesManagementComponent
    },
    {
        path: 'sales-history',
        component: SalesHistoryComponent
    }
];
