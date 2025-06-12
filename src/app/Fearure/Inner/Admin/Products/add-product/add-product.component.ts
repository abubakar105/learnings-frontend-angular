import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { from, of } from 'rxjs';
import {
  mergeMap,
  map,
  retry,
  catchError,
  toArray,
  tap,
  switchMap,
} from 'rxjs/operators';

import { AddProductHeaderComponent } from '../add-product-header/add-product-header.component';
import { AddProductImagesComponent } from '../add-product-images/add-product-images.component';
import { AddProductAttributesComponent } from '../add-product-attributes/add-product-attributes.component';
import { AddProductPriceComponent } from '../add-product-price/add-product-price.component';
import { AddProductCategoryComponent } from '../add-product-category/add-product-category.component';

import { ProductService } from '../../../../../Core/Services/ProductService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { ImageUploadService } from '../../../../../Core/Services/CloudinaryResponse';
import {
  AddedAttribute,
  ProductDto,
} from '../../../../../Shared/Contants/Product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddProductHeaderComponent,
    AddProductImagesComponent,
    AddProductAttributesComponent,
    AddProductPriceComponent,
    AddProductCategoryComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  editor!: Editor;
  imageFiles: File[] = [];

  product: ProductDto = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    isActive: true,
    categoryIds: [],
    attributes: [],
    imageUrls: [],
  };

  @ViewChild(AddProductAttributesComponent)
  attrComp!: AddProductAttributesComponent;

  constructor(
    private productService: ProductService,
    private toast: ToastService,
    private uploadSvc: ImageUploadService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get convertedAttributes(): AddedAttribute[] {
    return this.product.attributes.map((a) => ({
      attributeId: a.attributeTypeId,
      attributeValue: a.value,
    }));
  }

  onCategorySelected(selection: { parentId: string; subId: string }) {
    this.product.categoryIds = [
      {
        parentCategoryId: selection.parentId,
        childCategoryId: selection.subId,
      },
    ];
  }

  saveProduct() {
    // 1) build attributes payload
    this.product.attributes = this.attrComp.productAddedAttributesList.map(
      (attr) => ({
        attributeTypeId: attr.attributeId!,
        value: attr.attributeValue,
      })
    );

    // 2) run the upload + save logic outside Angular’s zone
    this.ngZone.runOutsideAngular(() => {
      from(this.imageFiles)
        .pipe(
          // upload up to 3 in parallel, retry twice on error
          mergeMap(
            (file) =>
              this.uploadSvc.uploadFile(file, file.name).pipe(
                map((res) => res.secure_url),
                retry(2),
                catchError((err) => {
                  console.error(`Upload failed for ${file.name}`, err);
                  return of<string | null>(null);
                })
              ),
            3
          ),
          toArray(), // collect all URLs into string[]
          tap((urls) => {
            // filter out any nulls
            this.product.imageUrls = urls.filter(
              (u): u is string => u !== null
            );
          }),
          // then post the product
          switchMap(() =>
            this.productService.addProduct(this.product).pipe(
              tap((res) => {
                if (res.status === 201) {
                  this.toast.success('Product saved successfully!');
                } else {
                  this.toast.error(res.message || 'Unknown error', 'Error');
                }
              })
            )
          ),
          // catch any error in upload or save
          catchError((err) => {
            console.error('Save workflow failed', err);
            this.toast.error('Failed to save product', 'Error');
            return of(null);
          })
        )
        .subscribe();
    });
  }
}
