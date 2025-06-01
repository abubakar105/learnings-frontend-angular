import { Component } from '@angular/core';
import { UserNavbarComponent } from "../../home/user-navbar/user-navbar.component";
import { RouterModule } from '@angular/router';
import { UserSidebarComponent } from "../../home/user-sidebar/user-sidebar.component";
import { ShowAllProductsComponent } from "../../home/show-all-products/show-all-products.component";

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [UserNavbarComponent, RouterModule, UserSidebarComponent, ShowAllProductsComponent],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {

}
