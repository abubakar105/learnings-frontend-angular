import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsFilterService, ProductFilter } from './ProductFilter';

@Injectable({ providedIn: 'root' })
export class ProductsQueryService {
  readonly params$: Observable<HttpParams>;

  constructor(private filterState: ProductsFilterService) {
    this.params$ = this.filterState.filterDescriptor$.pipe(
      map((f: ProductFilter) => {
        let params = new HttpParams()
          .set('Page',   f.Page.toString())
          .set('PageSize', f.PageSize.toString());

        if (f.Search) {
          params = params.set('Search', f.Search);
        }
        if (f.CategoryIds?.length) {
          params = params.set('CategoryIds', f.CategoryIds.join(','));
        }
        if (f.Gender) {
          params = params.set('Gender', f.Gender);
        }
        if (f.MinPrice != null) {
          params = params.set('MinPrice', f.MinPrice.toString());
        }
        if (f.MaxPrice != null) {
          params = params.set('MaxPrice', f.MaxPrice.toString());
        }
        if (f.SortBy) {
          params = params.set('SortBy', f.SortBy);
        }

        return params;
      })
    );
  }
}
