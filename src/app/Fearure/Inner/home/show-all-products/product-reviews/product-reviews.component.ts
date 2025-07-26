import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { ReviewsService } from '../../../../../Core/Services/ReviewsService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { CommonModule } from '@angular/common';
import { ReviewSignalrService } from '../../../../../Core/Services/ReviewSignalrService';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css',
})
export class ProductReviewsComponent implements OnInit, OnDestroy {
  private productId: string | null = null;
  private readonly destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private reviewsService = inject(ReviewsService);
  private signalr = inject(ReviewSignalrService);
  private toast = inject(ToastService);
  reviews: any[] = [];
  // constructor(
  //   private route: ActivatedRoute,
  //   private reviewsService: ReviewsService,
  //   private toast: ToastService
  // ) {}
  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        tap((params) => (this.productId = params['id'])),
        tap(() => this.loadInitialReviews())
      )
      .subscribe();
    this.signalr.newReview$
      .pipe(
        takeUntil(this.destroy$),
        filter((r) => r.productId === this.productId),
        tap((r) => (this.reviews = [r, ...this.reviews]))
      )
      .subscribe();
  }
  private loadInitialReviews() {
    this.reviewsService
      .getAllReviews(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.reviews = res.data;
          } else {
            this.toast.error('Failed to fetch reviews');
          }
        },
        error: () => this.toast.error('Error fetching reviews'),
      });
  }
  trackByReviewId(_: number, review: any): string {
    return review.reviewId;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
