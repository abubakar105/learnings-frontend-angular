import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';

export interface ProductFilter {
  Search?: string;
  CategoryIds?: string[];
  Gender?: string;
  MinPrice?: number;
  MaxPrice?: number;
  SortBy?: 'price_desc' | 'price_asc' | 'newest';
  Page: number;
  PageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsFilterService {
  private search$      = new BehaviorSubject<string>('');
  private categoryIds$ = new BehaviorSubject<string[] | null>(null);
  private gender$      = new BehaviorSubject<string | null>(null);
  private priceRange$  = new BehaviorSubject<{ min: number; max: number } | null>(null);
  private sort$        = new BehaviorSubject<'price_desc' | 'price_asc' | 'newest' | null>(null);

  /** Emits the full DTO‑shaped filter object */
  readonly filterDescriptor$: Observable<ProductFilter> = combineLatest([
    this.search$,
    this.categoryIds$,
    this.gender$,
    this.priceRange$,
    this.sort$,
  ]).pipe(
    debounceTime(200),
    map(([search, categoryIds, gender, priceRange, sortBy]) => {
      const f: ProductFilter = { Page: 1, PageSize: 20 };

      if (search)      { f.Search      = search; }
      if (categoryIds && categoryIds.length) { f.CategoryIds = categoryIds; }
      if (gender)      { f.Gender      = gender; }
      if (priceRange)  {
        f.MinPrice = priceRange.min;
        f.MaxPrice = priceRange.max;
      }
      if (sortBy)      { f.SortBy      = sortBy; }

      return f;
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  setSearch(term: string) {
    this.search$.next(term.trim());
  }
  setCategoryIds(ids: string[] | null) {
    this.categoryIds$.next(ids);
  }
  setGender(g: string | null) {
    this.gender$.next(g);
  }
  setPriceRange(range: { min: number; max: number } | null) {
    this.priceRange$.next(range);
  }
  setSort(sortBy: 'price_desc' | 'price_asc' | 'newest' | null) {
    this.sort$.next(sortBy);
  }
}
