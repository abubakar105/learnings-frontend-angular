import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { ProductDto } from '../../../../Shared/Contants/Product';

@Component({
  selector: 'app-add-product-header',
  standalone: true,
  imports: [
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './add-product-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductHeaderComponent implements OnInit, OnDestroy {
  @Input()  product!: ProductDto;
  @Output() productChange = new EventEmitter<ProductDto>();

  editor!: Editor;
  descriptionHtml = '';

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.editor = new Editor();
    });
    this.descriptionHtml = this.product.description;
  }

  onDescriptionBlur() {
    this.ngZone.run(() => {
      this.product.description = this.descriptionHtml;
      this.productChange.emit(this.product);
    });
  }
  emitChange(): void {
    this.productChange.emit(this.product);
  }
  ngOnDestroy() {
    this.editor.destroy();
  }
}
