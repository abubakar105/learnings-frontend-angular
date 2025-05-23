import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product-price',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-product-price.component.html',
  styleUrls: ['./add-product-price.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductPriceComponent {
  @Input() price: number = 0;
  @Output() priceChange: EventEmitter<number> = new EventEmitter<number>();  
  
  onPriceChange(): void {
    this.priceChange.emit(this.price);
  }
}
