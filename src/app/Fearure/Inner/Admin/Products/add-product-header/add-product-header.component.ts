import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { ProductDto } from '../../../../../Shared/Contants/Product';

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
export class AddProductHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()  product!: ProductDto;
  @Output() productChange = new EventEmitter<ProductDto>();

  editor!: Editor;
  descriptionHtml = '';

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // create the Editor instance outside Angular to avoid extra CD cycles
    this.ngZone.runOutsideAngular(() => {
      this.editor = new Editor();
    });
    // initialize with the incoming product description
    this.descriptionHtml = this.product.description;
  }

  ngAfterViewInit() {
    // grab the underlying DOM element (ProseMirror view)
    const dom = this.editor.view.dom;
    // use capture phase to ensure we catch the blur
    dom.addEventListener('blur', () => {
      // re-enter Angular zone so CD runs
      this.ngZone.run(() => {
        this.onDescriptionBlur();
        // because we’re OnPush, explicitly mark for check
        this.cdr.markForCheck();
      });
    }, true);
  }

onDescriptionBlur() {
  // grab only the plain text from the editor’s contenteditable container
  const currentText = this.editor.view.dom.textContent?.trim() ?? '';

  // sync your component state and your DTO
  this.descriptionHtml     = currentText;
  this.product.description = currentText;

  // emit the change
  this.productChange.emit(this.product);
}



 emitChange(): void {
    this.productChange.emit(this.product);
  }
  ngOnDestroy() {
    this.editor.destroy();
  }
}