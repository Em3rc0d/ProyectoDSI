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
      },
      {
        path: 'sales-edit/:id',
        component: SalesEditComponent,
      },
      {
        path: 'sales-register',
        component: SalesRegisterComponent,
      },
      {
        path: 'sales-search',
        component: SalesSearchComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products-register',
        component: ProductsRegisterComponent,
      },
      {
        path: 'products-search',
        component: ProductsSearchComponent,
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
      },
      {
        path: 'invoices-search',
        component: InvoiceSearchComponent,
      },
    ],
  },
];