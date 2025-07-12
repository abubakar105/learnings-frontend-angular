import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsFilterService } from '../../../../../Core/Services/ProductsFilterService';

@Component({
  selector: 'app-filter-by-price',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-by-price.component.html',
  styleUrls: ['./filter-by-price.component.css']
})
export class FilterByPriceComponent {
  rangeMin: number = 0;
  rangeMax: number = 100000;
  minPrice: number = this.rangeMin;
  maxPrice: number = this.rangeMax;
  step: number = 100;

    constructor(private filterSvc: ProductsFilterService) {}

  onMinInput(value: number) {
    this.minPrice = Math.min(Math.max(this.rangeMin, value), this.maxPrice);
    this.filterSvc.setPriceRange({min: this.minPrice, max: this.maxPrice});
  }
  onMaxInput(value: number) {
    this.maxPrice = Math.max(Math.min(this.rangeMax, value), this.minPrice);
    this.filterSvc.setPriceRange({min: this.minPrice, max: this.maxPrice});
  }
}