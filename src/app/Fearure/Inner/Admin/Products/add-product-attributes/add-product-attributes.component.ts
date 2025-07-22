import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { ProductService } from '../../../../../Core/Services/ProductService';

interface LookupAttribute {
  id: string;
  name: string;
}

export interface AddedAttribute {
  attributeId: string | null;
  attributeValue: string;
}

@Component({
  selector: 'app-add-product-attributes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductAttributesComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() initialAttributes: AddedAttribute[] = [];

  lookups: LookupAttribute[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toast: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialAttributes'] && this.initialAttributes?.length) {
      this.resetAttributes(this.initialAttributes);
    }
  }

  ngOnInit() {
    if (this.attributes.length === 0) {
      this.addAttribute();
    }

    this.productService.getAllLookupAttributes().subscribe({
      next: res => {
        if (res.status === 200) {
          this.lookups = res.data.map((a: any) => ({
            id: a.productsAttributeId,
            name: a.name
          }));
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      error: () => this.toast.error('Failed to fetch attributes', 'Error')
    });
  }

  get attributes(): FormArray {
    return this.form.get('attributeWithValue') as FormArray;
  }

  private createRow(data?: AddedAttribute) {
    return this.fb.group({
      attributeId: [data?.attributeId ?? null, Validators.required],
      attributeValue: [
        data?.attributeValue ?? '',
        [Validators.required, Validators.maxLength(10)]
      ]
    });
  }

  private resetAttributes(data: AddedAttribute[]) {
    const fa = this.fb.array(data.map(d => this.createRow(d)));
    this.form.setControl('attributeWithValue', fa);
  }

  addAttribute() {
    if (!this.canAddNewRow) {
      return;
    }
    this.attributes.push(this.createRow());
  }

  removeAttribute(idx: number) {
    this.attributes.removeAt(idx);
  }

  get canAddNewRow(): boolean {
    if (this.attributes.length <= 1) {
      return true;
    }
    const last = this.attributes.at(this.attributes.length - 1).value;
    return !!(last.attributeId && last.attributeValue.trim());
  }

  isDisabledAttribute(i: number, attrId: string) {
    return this.attributes.controls.some((_, idx) => {
      return idx !== i && this.attributes.at(idx).value.attributeId === attrId;
    });
  }
  trackByIndex(_: number, __: any) {
    return _;
  }
}
