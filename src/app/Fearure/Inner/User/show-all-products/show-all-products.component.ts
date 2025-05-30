import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../../../Core/Services/ProductService';
import { ToastService } from '../../../../Core/Services/ToastService';
import { ProductsDetailsComponent } from "./products-details/products-details.component";
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-show-all-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductsDetailsComponent],
  templateUrl: './show-all-products.component.html',
  styleUrl: './show-all-products.component.css',
})
export class ShowAllProductsComponent {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }
  goToDetail(productId:string){
    this.router.navigate([`products/${productId}`]);
  }
  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.products = res.data;
        } else {
          this.toast.error('Failed to load products', 'Error');
        }
      },
      error: (err) => {
        this.toast.error('Failed to load products', 'Error');
      },
    });
  }
}
