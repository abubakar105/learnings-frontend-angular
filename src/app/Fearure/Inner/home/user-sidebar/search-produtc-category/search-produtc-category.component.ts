import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../../../../../Core/Services/ProductCategoryService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { CommonModule } from '@angular/common';
import { ProductsFilterService } from '../../../../../Core/Services/ProductFilter';

@Component({
  selector: 'app-search-produtc-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-produtc-category.component.html',
  styleUrls: ['./search-produtc-category.component.css'],
})
export class SearchProdutcCategoryComponent implements OnInit {
  categoryList: any[] = [];
  constructor(
    private categorySerive: ProductCategoryService,
    private toast: ToastService,
    private filterService: ProductsFilterService
  ) {}
  ngOnInit(): void {
    this.categorySerive.getAllProductsParentCategory().subscribe(
      (res) => {
        if (res.status == 200) {
          this.categoryList = res.data;
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      (err) => {
        this.toast.error('Unable to load categories', 'Error');
      }
    );
  }
  onCategoryChange(categoryId: string) {
    this.filterService.setCategoryIds([categoryId]);
    console.log('Selected category:', this.categoryList.find(x => x.categoryId === categoryId)?.name);
  }
  trackById(_: number, item: any) {
  return item.attributeId;
}
}
