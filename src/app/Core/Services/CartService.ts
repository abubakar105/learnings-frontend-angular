// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  addProductToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Cart/items`, { productId, quantity });
  }
  getAllCartItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Cart`);
  }
  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Cart`);
  }
  removeItemFromCart(itemId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Cart/items/${itemId}`);
  }
  updateItemQuantity(cartItemId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Cart/items`, { cartItemId, quantity });
  }
}
