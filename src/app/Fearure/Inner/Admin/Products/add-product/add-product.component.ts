import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Editor, Validators } from 'ngx-editor';
import { forkJoin, from, of } from 'rxjs';
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
    ReactiveFormsModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  editor!: Editor;
  imageFiles: File[] = [];
  addProductForm: FormGroup;
  CONCURRENCY = 5;
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
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group({
      headerForm: this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        sku: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(3),
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(50),
            Validators.maxLength(500),
          ],
        ],
      }),
      priceForm: this.fb.group({
        price: [null, [Validators.required]],
      }),
      categoryForm: this.fb.group({
        parentCategoryId: [null, Validators.required],
        subCategoryId: [null, Validators.required],
      }),
      imageForm: this.fb.group({
        imageUrls: [[File], Validators.required],
      }),
      attributesForm: this.fb.group({
        attributeWithValue: this.fb.array([]),
      }),
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  childFormSend(formSelect: string): FormGroup {
    return this.addProductForm.get(formSelect)! as FormGroup;
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
    this.addProductForm.markAllAsTouched();
    this.addProductForm.get('imageForm')?.markAllAsTouched();
    console.log(this.addProductForm);
    var imageUrls = this.addProductForm
      .get('imageForm')
      ?.get('imageUrls')?.value;
    from(imageUrls)
      .pipe(
        mergeMap(
          (file) => this.uploadSvc.uploadFile$(file as File),
          this.CONCURRENCY
        ),
        toArray(),
        map((urls) => urls.filter((u): u is string => !!u))
      )
      .subscribe({
        next: (images) => {
          this.product.imageUrls = images;
          this.productService.addProduct(this.product).subscribe({
            next: (res) => {
              if (res.status === 201) {
                this.toast.success('Product saved successfully!');
                this.addProductForm.reset();
                this.product = {
                  name: '',
                  sku: '',
                  description: '',
                  price: 0,
                  isActive: true,
                  categoryIds: [],
                  attributes: [],
                  imageUrls: [],
                };
              } else {
                this.toast.error(res.message || 'Unknown error', 'Error');
              }
            },
            error: (err) => {
              console.error('Save product failed', err);
              this.toast.error('Failed to save product', 'Error');
            }
          });
        },
        error: (err) => {
          this.toast.error('Unexpected error in uploads', 'Error');
        },
      });
  }
}
