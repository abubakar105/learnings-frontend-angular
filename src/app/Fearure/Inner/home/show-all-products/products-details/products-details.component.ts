// products-details.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../../../Core/Services/ProductService';
import { ProductCategoryService } from '../../../../../Core/Services/ProductCategoryService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { CartService } from '../../../../../Core/Services/CartService';
import { ProductReviewsComponent } from "../product-reviews/product-reviews.component";

// Strongly-typed interfaces
interface CategoryId {
  parentCategoryId?: string;
  childCategoryId?: string;
}

interface LookupValue {
  name: string;
  values: { value: string }[];
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  imageUrls?: string[];
  categoryIds?: CategoryId[];
  attributes?: { attributeTypeId: string }[];
  lookupValues?: LookupValue[];
}

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [CommonModule, ProductReviewsComponent],
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsDetailsComponent implements OnInit {
  selectedProduct: Product | null = null;
  mainImage = '';
  qty = 1;
  productCategory = '';
  productsAttributes: string[] = [];
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: ProductCategoryService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetchProductDetails();
    }
  }

  private fetchProductDetails(): void {
    // Fetch product by ID
    this.productService.getProductById(this.productId!).subscribe({
      next: (res) => {
        if (res.status !== 200) {
          this.toast.error(res.message, 'Error');
          return;
        }

        this.selectedProduct = res.data as Product;
        // Set main image
        this.mainImage = this.selectedProduct.imageUrls?.[0] ?? '';
        // Determine category ID
        const cat = this.selectedProduct.categoryIds?.[0];
        this.productCategory = cat?.childCategoryId ?? cat?.parentCategoryId ?? '';
        // Prepare attributes
        this.productsAttributes = this.selectedProduct.attributes?.map(
          (attr) => attr.attributeTypeId
        ) ?? [];

        if (this.productsAttributes.length && this.productCategory) {
          this.loadLookupAndCategory();
        }
      },
      error: () => {
        this.toast.error('Failed to load product', 'Error');
      },
    });
  }

  private loadLookupAndCategory(): void {
    const lookupBody = {
      productId: this.productId!,
      productsAttributesIds: this.productsAttributes,
    };

    const lookup$ = this.productService.getLookUpValue(lookupBody);
    const category$ = this.categoryService.getProductCategoryById(
      this.productCategory
    );

    forkJoin({ lookupRes: lookup$, categoryRes: category$ }).subscribe({
      next: ({ lookupRes, categoryRes }) => {
        if (lookupRes.status === 200) {
          this.selectedProduct!.lookupValues = lookupRes.data;
        } else {
          this.toast.error(lookupRes.message, 'Error');
        }

        if (categoryRes.status === 200) {
          this.productCategory = categoryRes.data.name;
        } else {
          this.toast.error(categoryRes.message, 'Error');
        }
      },
      error: () => {
        this.toast.error('Failed to load lookup values or category', 'Error');
      },
    });
  }

  onThumbnailClick(url: string): void {
    this.mainImage = url;
  }

  decreaseQty(): void {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  increaseQty(): void {
    this.qty++;
  }

  buyNow(): void {
    console.log('Buy now', this.selectedProduct, 'qty', this.qty);
  }

  addToCart(): void {
    this.cartService.addProductToCart(this.productId!, this.qty).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.toast.success('Product added to cart successfully', 'Success');
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      error: () => {
        this.toast.error('Failed to add product to cart', 'Error');
      },
    });
  }
}
