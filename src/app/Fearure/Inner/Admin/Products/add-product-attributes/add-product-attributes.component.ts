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
import { ColorPickerModule } from 'ngx-color-picker';

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
  imports: [CommonModule, ReactiveFormsModule,ColorPickerModule],
  templateUrl: './add-product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductAttributesComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() initialAttributes: AddedAttribute[] = [];
  genders: string[] = ['Male', 'Female'];
  size: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
 arrayColors: { [key: string]: string } = {
    color1: '#ffffff',
    color2: '#f0f0f0'
  };
  selectedColor: string = 'color1';
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
    debugger
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
  const values = Array.isArray(data?.attributeValue)
    ? data.attributeValue
    : data?.attributeValue ? [data.attributeValue] : [];

  return this.fb.group({
    attributeId:     [data?.attributeId ?? null, Validators.required],
    attributeValue:  [data?.attributeValue ?? null],        // single-value (size/gender/text)
    attributeValues: this.fb.array(                         // multi-value (color or, now, multi-size)
      values.map(v => this.fb.control(v, [Validators.required, Validators.maxLength(10)]))
    )
  });
}
/** On a multi-select change, wipe & re-populate attributeValues with every checked option */
  onMultiSelectChange(evt: Event, index: number) {
    const select = evt.target as HTMLSelectElement;
    const chosen = Array.from(select.selectedOptions).map(o => o.value);
    const arr = this.attributes.at(index).get('attributeValues') as FormArray;
    arr.clear();
    chosen.forEach(val => arr.push(this.fb.control(val, [Validators.required, Validators.maxLength(10)])));
  }
  /** get the FormArray for this row */
private valuesArray(i: number): FormArray {
  return this.attributes.at(i).get('attributeValues') as FormArray;
}

/** is this size already in the array? */
isSizeSelected(i: number, size: string): boolean {
  return this.valuesArray(i).controls.some(c => c.value === size);
}

/** add or remove the size from the FormArray */
toggleSize(i: number, size: string, checked: boolean) {
  const arr = this.valuesArray(i);
  if (checked) {
    arr.push(this.fb.control(size, [Validators.required, Validators.maxLength(10)]));
  } else {
    const idx = arr.controls.findIndex(c => c.value === size);
    if (idx > -1) arr.removeAt(idx);
  }
}


colorValues(i: number): FormArray {
  debugger
  return this.attributes.at(i).get('attributeValues') as FormArray;
}

addValue(i: number) {
  debugger
  this.colorValues(i).push(
    this.fb.control(null, [Validators.required, Validators.maxLength(10)])
  );
}

removeValue(i: number, j: number) {
  debugger
  this.colorValues(i).removeAt(j);
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
    if (this.attributes.length == 0) {
      return true;
    }
    const last = this.attributes.at(this.attributes.length - 1).value;
    return !!(last.attributeId && last.attributeValue==null);
  }
  getAttributeName(i: number): string | null {
    
    const id = this.attributes.at(i).value.attributeId;
    return this.lookups.find(l => l.id === id)?.name ?? null;
  }

  isDisabledAttribute(i: number, attrId: string) {
    return this.attributes.controls.some((_, idx) => {
      return idx !== i && this.attributes.at(idx).value.attributeId === attrId;
    });
  }
  trackByIndex(_: number, __: any) {
    return _;
  }
  onColorChange(newColor: string): void {
    debugger
    this.arrayColors[this.selectedColor] = newColor;
  }
  check(){
    console.log(this.form.get('attributeWithValue')?.value);
  }
}
