import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';

@Injectable({ providedIn: 'root' })


export class ProductsFilterService {

  private search$ = new BehaviorSubject<string>('');
  private category$ = new BehaviorSubject<string | null>(null);
  private gender$ = new BehaviorSubject<string | null>(null);
  private priceRange$ = new BehaviorSubject<{
    min: number;
    max: number;
  } | null>(null);
  
  private sort$ = new BehaviorSubject<'asc' | 'desc' | null>(null);

  setSearch(term: string) {
    this.search$.next(term);
  }
  setCategory(cat: string | null) {
    this.category$.next(cat);
  }
  setGender(g: string | null) {
    this.gender$.next(g);
  }
  setPriceRange(r: { min: number; max: number } | null) {
    this.priceRange$.next(r);
  }
  setSort(o: 'asc' | 'desc' | null) {
    this.sort$.next(o);
  }

  readonly filterDescriptor$ = combineLatest([
    this.search$,
    this.category$,
    this.gender$,
    this.priceRange$,
    this.sort$,
  ]).pipe(
    debounceTime(300),
    map(
      ([search, category, gender, price, sort]: [
        string,
        string | null,
        string | null,
        { min: number; max: number } | null,
        'asc' | 'desc' | null
      ]) => {
        const filters: string[] = [];

        if (search?.trim()) {
          const s = search.trim().replace("'", "''");
          filters.push(
            `(contains(Name,'${s}') or contains(Description,'${s}'))`
          );
        }
        if (category) {
          filters.push(`Category eq '${category}'`);
        }
        if (gender) {
          filters.push(`Gender eq '${gender}'`);
        }
        if (price) {
          filters.push(`Price ge ${price.min} and Price le ${price.max}`);
        }

        const filterQuery = filters.join(' and ');
        const orderBy = sort ? `Name ${sort}` : null;

        return { filter: filterQuery, orderBy };
      }
    ),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );
}
