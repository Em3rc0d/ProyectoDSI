import { Routes } from '@angular/router';
import { InvoiceSearchComponent } from './components/useless/invoice-search/invoice-search.component';
import { LowInventoryReportComponent } from './components/useless/low-inventory-report/low-inventory-report.component';
import { SalesManagementComponent } from './components/useless/sales-management/sales-management.component';
// import { SalesHistoryComponent } from './components/sales-history/sales-history.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesRegisterComponent } from './components/sales/sales-register/sales-register.component';
import { SalesSearchComponent } from './components/sales/sales-search/sales-search.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductRegisterComponent } from './components/products/products-register/products-register.component';
import { ProductsSearchComponent } from './components/products/products-search/products-search.component';
import { RegisterComponent } from './components/welcome/register/register.component';

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
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'products-register',
        component: ProductRegisterComponent
    },
    {
        path: 'products-search',
        component: ProductsSearchComponent
    },
    {
        path: 'login',
        component: WelcomeComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
