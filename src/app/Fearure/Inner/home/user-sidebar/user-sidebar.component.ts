import { Component } from '@angular/core';
import { SearchProdutcCategoryComponent } from "./search-produtc-category/search-produtc-category.component";
import { SortByFilterComponent } from "./sort-by-filter/sort-by-filter.component";
import { FilterByGenderComponent } from "./filter-by-gender/filter-by-gender.component";
import { FilterByPriceComponent } from "./filter-by-price/filter-by-price.component";

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [SearchProdutcCategoryComponent, SortByFilterComponent, FilterByGenderComponent, FilterByPriceComponent],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {

}
