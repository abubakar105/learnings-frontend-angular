import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../../../../../Core/Services/ProductCategoryService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { CommonModule } from '@angular/common';

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
    private filterSvc: ProductCategoryService
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
  trackById(_: number, item: any) {
  return item.attributeId;
}
}
