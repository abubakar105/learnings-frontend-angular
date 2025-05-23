import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

import { AddProductHeaderComponent } from '../add-product-header/add-product-header.component';
import { AddProductImagesComponent } from '../add-product-images/add-product-images.component';
import { AddProductAttributesComponent } from '../add-product-attributes/add-product-attributes.component';
import { AddProductPriceComponent } from '../add-product-price/add-product-price.component';

import { ProductService } from '../../../../Core/Services/ProductService';
import { ToastService } from '../../../../Core/Services/ToastService';
import {
  AddedAttribute,
  ProductDto,
} from '../../../../Shared/Contants/Product';
import { AddProductCategoryComponent } from '../add-product-category/add-product-category.component';

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
  editor: Editor;
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
    private toast: ToastService
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
    this.product.attributes = this.attrComp.productAddedAttributesList.map(
      (attr) => ({
        attributeTypeId: attr.attributeId!,
        value: attr.attributeValue,
      })
    );
    let sortedOrderCounter = 0;
    this.product.imageUrls = this.imageFiles.map((file) =>  file.name);
    this.productService.addProduct(this.product).subscribe(
      (res) => {
        if (res.status === 201) {
          this.toast.success('Product saved successfully!');
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      () => this.toast.error('Failed to save product', 'Error')
    );
  }
}
