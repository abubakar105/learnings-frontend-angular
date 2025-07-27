import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Editor,
  NgxEditorMenuComponent,
  NgxEditorComponent,
  Toolbar,
} from 'ngx-editor';
import { ReviewsService } from '../../../../../Core/Services/ReviewsService';
import { ToastService } from '../../../../../Core/Services/ToastService';

@Component({
  selector: 'app-add-product-review',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorMenuComponent,
    NgxEditorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product-review.component.html',
  styleUrls: ['./add-product-review.component.css'],
})
export class AddProductReviewComponent implements OnInit, OnDestroy {
  @Input() productId!: string;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    productId: new FormControl('', Validators.required),
    rating: new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    title: new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(5),
      Validators.required,
    ]),
    body: new FormControl('', [
      Validators.required,
      Validators.minLength(30),
      Validators.maxLength(500),
    ]),
  });

  constructor(private toastService: ToastService, private ngZone: NgZone, private cdr: ChangeDetectorRef, private reviewService: ReviewsService) {}

  ngOnInit() {
    if (this.productId) {
      this.form.patchValue({ productId: this.productId });
    }
    this.ngZone.runOutsideAngular(() => {
      this.editor = new Editor();
    });
  }
  onBodyBlur() {
    const html = this.editor.view.dom.innerHTML;
    this.form.patchValue({ body: html });
    this.cdr.markForCheck();
  }
  ngAfterViewInit() {
    const dom = this.editor.view.dom;
    dom.addEventListener(
      'blur',
      () => {
        this.ngZone.run(() => {
          this.form.patchValue({ body: dom.innerHTML });
          this.cdr.markForCheck();
        });
      },
      true
    );
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const dto = this.form.value;

    this.reviewService.addProductReview(dto).subscribe({
      next: (res) => {
        if (res.status === 201) {
          this.form.reset();
          this.editor.view.dom.innerHTML = '';
          this.cdr.markForCheck();
          this.toastService.success('Review added successfully', 'Success');
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      error: (err) => {
        this.toastService.error('Error adding review:', 'Error');
      },
    });

  }
}
