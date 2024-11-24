import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/welcome/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/home/start/start.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesRegisterComponent } from './components/sales/sales-register/sales-register.component';
import { SalesSearchComponent } from './components/sales/sales-search/sales-search.component';
import { SalesEditComponent } from './components/sales/sales-edit/sales-edit.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductsRegisterComponent } from './components/products/products-register/products-register.component';
import { ProductsSearchComponent } from './components/products/products-search/products-search.component';
import { InvoicesComponent } from './components/sales/invoices/invoices.component';
import { InvoiceSearchComponent } from './components/sales/invoices/invoice-search/invoice-search.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard'; // Importa el RoleGuard
import { ProductsAddComponent } from './components/products/products-add/products-add.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: WelcomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin']}
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protege esta ruta
    children: [
      {
        path: '',
        component: StartComponent,
      },
      {
        path: 'start',
        component: StartComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'sales-edit/:id',
        component: SalesEditComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin'] }  // Los roles permitidos
      },
      {
        path: 'sales-register',
        component: SalesRegisterComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'sales-search',
        component: SalesSearchComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'products-register',
        component: ProductsRegisterComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin'] }  // Solo admin puede registrar productos
      },
      {
        path: 'products-add-inventory',
        component: ProductsAddComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin'] }  // Los roles permitidos
      },
      {
        path: 'products-search',
        component: ProductsSearchComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
      {
        path: 'invoices-search',
        component: InvoiceSearchComponent,
        canActivate: [AuthGuard, RoleGuard],  // Protección por rol
        data: { roles: ['admin', 'vendedor'] }  // Los roles permitidos
      },
    ],
  },
];
