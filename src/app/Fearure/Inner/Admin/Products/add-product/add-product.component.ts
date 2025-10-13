import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Editor, Validators } from 'ngx-editor';
import { forkJoin, from, Observable, of } from 'rxjs';
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
  productCategory: { parentCategoryId: string; childCategoryId: string }[] = [];
  product: ProductDto = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    isActive: true,
    categoryIds: this.productCategory,
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

  mapValues(){
    this.addProductForm.get('imageForm')?.markAllAsTouched();
    console.log(this.addProductForm);
    this.product.name = this.addProductForm
      .get('headerForm')
      ?.get('name')?.value;
    this.product.sku = this.addProductForm.get('headerForm')?.get('sku')?.value;
    this.product.description = this.addProductForm
      .get('headerForm')
      ?.get('description')?.value;
    this.product.price = this.addProductForm
      .get('priceForm')
      ?.get('price')?.value;

    const categoryIds = this.addProductForm.get('categoryForm')?.value;
    console.log('Product to d:', categoryIds);
    this.product.categoryIds = [
      {
        parentCategoryId: categoryIds.parentCategoryId,
        childCategoryId: categoryIds.subCategoryId,
      },
    ];
    this.product.isActive = true;
    const raw = this.attrComp.attributes.value;
    console.log('Attributes:', raw);

    const mapped = raw
      .filter((attr: any) =>
        Array.isArray(attr.attributeValues) && attr.attributeValues.length > 0
          ? true
          : !!attr.attributeValue
      )
      .map((attr: any) => {
        const multi =
          Array.isArray(attr.attributeValues) &&
          attr.attributeValues.length > 0;
        const value = multi
          ? (attr.attributeValues as string[]).join(',')
          : attr.attributeValue;

        return {
          attributeTypeId: attr.attributeId,
          value,
        };
      });
    console.log('Mapped attributes:', mapped);

    this.product.attributes = mapped;
    this.product.categoryIds = this.product.categoryIds.filter(
      (c) => c.parentCategoryId && c.childCategoryId
    );
    this.product.imageUrls = this.addProductForm
      .get('imageForm')
      ?.get('imageUrls')?.value;
    console.log('Product to save:', this.product);
    if (this.addProductForm.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      return;
    }
  }
  // in AddProductComponent
addProductWithFiles(product: ProductDto, imageFiles: File[]) {
  const formData = new FormData();

  formData.append('Name', product.name);
  formData.append('SKU', product.sku);
  formData.append('Description', product.description);
  formData.append('Price', product.price.toString());
  formData.append('IsActive', product.isActive.toString());

  product.categoryIds.forEach((cat, index) => {
    formData.append(`CategoryIds[${index}].parentCategoryId`, cat.parentCategoryId);
    formData.append(`CategoryIds[${index}].childCategoryId`, cat.childCategoryId);
  });

  product.attributes.forEach((attr, index) => {
    formData.append(`Attributes[${index}].attributeTypeId`, attr.attributeTypeId);
    formData.append(`Attributes[${index}].value`, attr.value);
  });

  imageFiles.forEach((file) => {
    // append multiple files under same name to bind to List<IFormFile>
    formData.append('ImageUrls', file, file.name);
  });

  // Return the observable so caller can subscribe
  return this.productService.addProduct(formData);
}

  saveProduct() {
  this.addProductForm.markAllAsTouched();
  
  if (this.addProductForm.invalid) {
    this.toast.error('Please fill all required fields', 'Error');
    // return;
  }

  this.mapValues();

  // Get the actual File objects from the form
  // inside saveProduct()
const imageFiles: File[] = this.addProductForm.get('imageForm')?.get('imageUrls')?.value || [];

if (!imageFiles || imageFiles.length === 0) {
  this.toast.error('Please select at least one image', 'Error');
  return;
}

// send FormData
this.addProductWithFiles(this.product, imageFiles).subscribe({
  next: (res: any) => {
    if (res?.status === 201 || res?.statusCode === 201) {
      this.toast.success('Product saved successfully!');
      this.addProductForm.reset();
      this.resetProduct();
    } else {
      this.toast.error(res?.message || 'Unknown error', 'Error');
    }
  },
  error: (err:any) => {
    console.error('Save product failed', err);
    this.toast.error('Failed to save product', 'Error');
  }
});

}

private resetProduct() {
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
  this.imageFiles = [];
}
  // saveProduct() {
  //   debugger;
  //   this.addProductForm.markAllAsTouched();
  //   this.mapValues();
  //   var imageUrls = this.addProductForm
  //     .get('imageForm')
  //     ?.get('imageUrls')?.value;
  //   this.product.imageUrls = imageUrls;
      
  //   // from(imageUrls)
  //   //   .pipe(
  //   //     mergeMap(
  //   //       (file) => this.uploadSvc.uploadFile$(file as File),
  //   //       this.CONCURRENCY
  //   //     ),
  //   //     toArray(),
  //   //     map((urls) => urls.filter((u): u is string => !!u))
  //   //   )
  //   //   .subscribe({
  //   //     next: (images) => {
  //   //       this.product.imageUrls = images;
  //         this.productService.addProduct(this.product).subscribe({
  //           next: (res) => {
  //             if (res.status === 201) {
  //               this.toast.success('Product saved successfully!');
  //               this.addProductForm.reset();
  //               this.product = {
  //                 name: '',
  //                 sku: '',
  //                 description: '',
  //                 price: 0,
  //                 isActive: true,
  //                 categoryIds: [],
  //                 attributes: [],
  //                 imageUrls: [],
  //               };
  //             } else {
  //               this.toast.error(res.message || 'Unknown error', 'Error');
  //             }
  //           },
  //           error: (err) => {
  //             console.error('Save product failed', err);
  //             this.toast.error('Failed to save product', 'Error');
  //           },
  //         });
  //       // },
  //       // error: (err) => {
  //       //   this.toast.error('Unexpected error in uploads', 'Error');
  //       // },
  //     // });
  // }
}
