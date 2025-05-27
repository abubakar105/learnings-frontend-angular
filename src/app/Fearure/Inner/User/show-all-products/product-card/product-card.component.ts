// product-card.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number; // 0-5
  imageUrl: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}