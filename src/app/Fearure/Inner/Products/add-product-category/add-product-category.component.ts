import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { ProductCategoryService } from '../../../../Core/Services/ProductCategoryService';
import { ToastService } from '../../../../Core/Services/ToastService';

interface Category {
  id: string;
  name: string;
}
interface RawCategory {
  id: string;
  name: string;
  parentId: string | null;
}

@Component({
  selector: 'app-add-product-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductCategoryComponent {
  readonly all$: Observable<RawCategory[]>;
  readonly parentCategories$: Observable<Category[]>;
  readonly allSubCategories$: Observable<Category[]>;

  selectedParentId: string | null = null;
  selectedSubId: string | null = null;

  @Output() categoryChange = new EventEmitter<{ parentId: string; subId: string }>();

  constructor(
    private productCategoryService: ProductCategoryService,
    private toast: ToastService
  ) {
    this.all$ = this.productCategoryService.getAllProductCategoryService().pipe(
      map(res => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        return res.data.map((a: any) => ({
          id: a.categoryId,
          name: a.name,
          parentId: a.parentCategoryId as string | null,
        }));
      }),
      catchError(err => {
        this.toast.error('Failed to load categories', 'Error');
        return of<RawCategory[]>([]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.parentCategories$ = this.all$.pipe(
      map(all =>
        all
          .filter(c => c.parentId === null)
          .map(c => ({ id: c.id, name: c.name }))
      )
    );

    this.allSubCategories$ = this.all$.pipe(
      map(all =>
        all
          .filter(c => c.parentId !== null)
          .map(c => ({ id: c.id, name: c.name }))
      )
    );
  }

  onParentChange(parentId: string) {
    this.selectedParentId = parentId;
    this.selectedSubId = null;
    this.emitChange();
  }

  onSubChange(subId: string) {
    this.selectedSubId = subId;
    this.emitChange();
  }

  private emitChange() {
    if (this.selectedParentId && this.selectedSubId) {
      this.categoryChange.emit({
        parentId: this.selectedParentId,
        subId: this.selectedSubId,
      });
    }
  }

  trackById(_: number, item: Category) {
    return item.id;
  }
}
