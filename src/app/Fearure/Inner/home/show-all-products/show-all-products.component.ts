import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../../../Core/Services/ProductService';
import { ToastService } from '../../../../Core/Services/ToastService';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { NavigationExtras, Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

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
})
export class ShowAllProductsComponent {
  products: any[] = [];
  searchQuery: string = '';
  searchControl = new FormControl('');
  private searchSub!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
  this.searchControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(500),
      filter((raw): raw is string => raw != null),
      distinctUntilChanged(),
      filter(raw => raw === '' || raw.trim().length > 0),
      map(raw => raw.trim()),
      switchMap(searchTerm =>
        this.productService.getAllProducts(searchTerm).pipe(
          catchError(err => {
            this.toast.error('Failed to load products', 'Error');
            return of([] as any[]);
          })
        )
      ),
      takeUntil(this.destroy$)
    )
    .subscribe(products => {
      this.products = products;
    });

}
  goToDetail(productId: string) {
    this.router.navigate(['/user/products', productId]);
  }
  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }
  fetchProducts(search: string = ''): void {
    this.productService.getAllProducts(search.trim()).subscribe({
      next: (res) => {
        if (res) {
          this.products = res;
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
