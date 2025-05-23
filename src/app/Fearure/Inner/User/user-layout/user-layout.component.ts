import { Component } from '@angular/core';
import { UserNavbarComponent } from "../user-navbar/user-navbar.component";
import { RouterModule } from '@angular/router';
import { UserSidebarComponent } from "../user-sidebar/user-sidebar.component";
import { ShowAllProductsComponent } from "../show-all-products/show-all-products.component";

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [UserNavbarComponent, RouterModule, UserSidebarComponent, ShowAllProductsComponent],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {

}
