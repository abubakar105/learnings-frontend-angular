import { Component } from '@angular/core';
import { SearchProdutcCategoryComponent } from "./search-produtc-category/search-produtc-category.component";

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [SearchProdutcCategoryComponent],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {

}
