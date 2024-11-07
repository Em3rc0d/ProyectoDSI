import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductManagementComponent } from "./components/product-management/product-management.component";
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    ProductManagementComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoDSI';
}
