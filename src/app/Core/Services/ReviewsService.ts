import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  getAllReviews(productId: string | null): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Reviews/getAllProductReviews/${productId}`);
  }
  addProductReview(reviewBody:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Reviews`, reviewBody);
  }
}
