import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductsFilterService } from '../../../../../Core/Services/ProductsFilterService';

interface SortOption {
  attributeId: number;
  name: string;
  iconSvg: SafeHtml;
  orderBy: string;
}

@Component({
  selector: 'app-sort-by-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-by-filter.component.html',
  styleUrls: ['./sort-by-filter.component.css']
})
export class SortByFilterComponent {
  sortByList: SortOption[];

  private svgMap: Record<string, string> = {
    'Newest': `
      <svg class="w-5 h-5 text-gray-700 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
           xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4V1L8 5l4 4V6c3.86 0 7 3.14 7 7 0 .46-.04.91-.1 1.35l1.46 1.46C20.84 14.02 21 13.02 21 12c0-4.97-4.03-9-9-9z"/>
      </svg>
    `,
    'Price: High-Low': `
      <svg class="w-5 h-5 text-gray-700 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
           xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 17h16v2H4zm4-6h12v2H8zm8-6h4v2h-4z"/>
      </svg>
    `,
    'Price: Low-High': `
      <svg class="w-5 h-5 text-gray-700 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
           xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v2H4zm4 6h12v2H8zm8 6h4v2h-4z"/>
      </svg>
    `
  };

  constructor(
    private sanitizer: DomSanitizer,
    private filterSvc: ProductsFilterService
  ) {
    this.sortByList = [
  {
    attributeId: 1,
    name: 'Newest',
    iconSvg: this.sanitizer.bypassSecurityTrustHtml(this.svgMap['Newest']),
    orderBy: 'CreatedAt desc'
  },
  {
    attributeId: 2,
    name: 'Price: High-Low',
    iconSvg: this.sanitizer.bypassSecurityTrustHtml(this.svgMap['Price: High-Low']),
    orderBy: 'Price desc'
  },
  {
    attributeId: 3,
    name: 'Price: Low-High',
    iconSvg: this.sanitizer.bypassSecurityTrustHtml(this.svgMap['Price: Low-High']),
    orderBy: 'Price asc'
  }
];


  }

  trackById(_: number, item: SortOption) {
    return item.attributeId;
  }

  selectSort(option: SortOption) {
    this.filterSvc.setSort(option.orderBy as 'asc' | 'desc');
  }
}