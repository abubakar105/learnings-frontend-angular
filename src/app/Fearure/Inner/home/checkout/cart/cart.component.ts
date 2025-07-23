import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../../Core/Services/CartService';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { debounce, debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  private quantityChanges = new Subject<{ cartItemId: string; quantity: number }>();

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    this.loadCartItems();
    this.quantityChanges.pipe(
      debounceTime(1000),
       distinctUntilChanged((a, b) =>
        a.cartItemId === b.cartItemId && a.quantity === b.quantity
      ),
      switchMap(change =>
        this.cartService.updateItemQuantity(change.cartItemId, change.quantity)
      )
    ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastService.success('Cart updated successfully', 'Success');
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      error: () => {
        this.toastService.error('Failed to update cart item', 'Error');
      },
    });
  }

  private loadCartItems() {
    this.cartService.getAllCartItems().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.cart = res.data.items;
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      error: () => {
        this.toastService.error('Failed to load cart items', 'Error');
      },
    });
  }
  increment(item: any) {
    item.quantity++;
    this.quantityChanges.next({ cartItemId: item.cartItemId, quantity: item.quantity });
  }

  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.quantityChanges.next({ cartItemId: item.cartItemId, quantity: item.quantity });
    }
  }
  remove(item: any) {
    this.cartService.removeItemFromCart(item.cartItemId).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.toastService.warning('Item removed from cart', 'Warning');
          this.cart = this.cart.filter(i => i.cartItemId !== item.cartItemId);
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      error: () => {
        this.toastService.error('Failed to remove cart item', 'Error');
      },
    });
  }
  clearCart() {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.toastService.warning('Cart cleared', 'Warning');
          this.cart = [];
        } else {
          this.toastService.error(res.message, 'Error');
        }
      },
      error: () => {
        this.toastService.error('Failed to remove cart item', 'Error');
      },
    });
  }
}
