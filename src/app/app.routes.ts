import { Routes } from '@angular/router';
import { InvoiceSearchComponent } from './components/useless/invoice-search/invoice-search.component';
import { LowInventoryReportComponent } from './components/useless/low-inventory-report/low-inventory-report.component';
import { SalesManagementComponent } from './components/useless/sales-management/sales-management.component';
// import { SalesHistoryComponent } from './components/sales-history/sales-history.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesRegisterComponent } from './components/sales/sales-register/sales-register.component';
import { SalesSearchComponent } from './components/sales/sales-search/sales-search.component';

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
        path: 'sales',
        component: SalesComponent,
    },
    {
        path: 'sales-register',
        component: SalesRegisterComponent
    },
    {
        path: 'sales-search',
        component: SalesSearchComponent
    }
];
