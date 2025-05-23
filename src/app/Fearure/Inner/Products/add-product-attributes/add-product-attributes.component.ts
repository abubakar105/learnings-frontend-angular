import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { ToastService }   from '../../../../Core/Services/ToastService';
import { ProductService } from '../../../../Core/Services/ProductService';

interface LookupAttribute {
  id: string;
  name: string;
}

interface AddedAttribute {
  attributeId: string | null;
  attributeValue: string;
}

@Component({
  selector: 'app-add-product-attributes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-attributes.component.html',
  styleUrls: ['./add-product-attributes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductAttributesComponent implements OnInit, OnChanges {
  ProductsLookupsAttributes: LookupAttribute[] = [];
  productAddedAttributesList: AddedAttribute[] = [];
   @Input() initialAttributes: AddedAttribute[] = [];
  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}
 ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialAttributes'] && this.initialAttributes.length > 0) {
      this.productAddedAttributesList = [...this.initialAttributes];
    }
  }
  ngOnInit(): void {
      this.productAddedAttributesList = [...this.initialAttributes];

    this.productService.getAllLookupAttributes().subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.ProductsLookupsAttributes = res.data.map((a: any) => ({
            id: a.productsAttributeId,
            name: a.name
          }));
          this.addAttribute();
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      () => this.toastService.error('Failed to fetch product attributes', 'Error')
    );
  }

get canAddNewRow(): boolean {
  if (this.productAddedAttributesList.length === 0) {
    return true;
  }
  const last = this.productAddedAttributesList[this.productAddedAttributesList.length - 1];
  return last.attributeId !== null && last.attributeValue.trim() !== '';
}
trackById(_: number, item: AddedAttribute) {
  return item.attributeId;
}
  addAttribute(): void {
    if (this.productAddedAttributesList.length && !this.canAddNewRow) return;
    this.productAddedAttributesList.push({ attributeId: null, attributeValue: '' });

    console.log(this.productAddedAttributesList);
  }

  removeAttribute(idx: number): void {
    this.productAddedAttributesList.splice(idx, 1);
  }

  onAttributeChange(idx: number): void {
    // nothing extra needed here unless you want to auto-add a new row:
    if (this.canAddNewRow) {
      // optional: auto-add next row as soon as they pick this one
      // this.addAttribute();
    }
  }

  isDisabledAttribute(currentIndex: number, attrId: string): boolean {
    return this.productAddedAttributesList.some((row, index) =>
      index !== currentIndex && row.attributeId === attrId
    );
  }
}
