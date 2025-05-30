// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  getAllProductCategoryService(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Categories`);
  }
  getProductCategoryById(id:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Categories/${id}`);
  }
  getAllProductsParentCategory(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Categories/AllParentCategories`);
  }
}
