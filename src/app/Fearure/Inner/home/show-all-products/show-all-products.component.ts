import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../../../Core/Services/ProductService';
import { ToastService } from '../../../../Core/Services/ToastService';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { NavigationExtras, Router } from '@angular/router';
import {
  ProductFilter,
  ProductsFilterService,
} from '../../../../Core/Services/ProductFilter';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ProductsQueryService } from '../../../../Core/Services/paramsSetService';

@Component({
  selector: 'app-show-all-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './show-all-products.component.html',
  styleUrl: './show-all-products.component.css',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAllProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  searchBox = new FormControl('');
  destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private toast: ToastService,
    private router: Router,
    private filterService: ProductsFilterService,
    private queryService: ProductsQueryService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.searchBox.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => this.filterService.setSearch(term ?? ''));

    this.queryService.params$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => this.productService.getAllProducts(params))
      )
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.products = res.data?.items || [];
          } else {
            this.toast.error('Failed to load products', 'Error');
          }
        },
        error: () => this.toast.error('Failed to load products', 'Error'),
      });
  }
  trackById(index: number, product: any) {
    return product.productId;
  }
  goToDetail(productId: string) {
    this.router.navigate(['/user/products', productId]);
  }
}
