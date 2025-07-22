import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product-price',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './add-product-price.component.html',
  styleUrls: ['./add-product-price.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductPriceComponent {
  @Input() price: number = 0;
  @Output() priceChange: EventEmitter<number> = new EventEmitter<number>();  
  @Input () priceForm!: FormGroup;
  onPriceChange(): void {
    console.log("Price changed:", this.priceForm);
    // this.priceChange.emit(this.price);
  }
}
