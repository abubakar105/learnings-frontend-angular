import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


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
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  
  cart: CartItem[] = [
    {
      id: 1,
      name: 'Super Games',
      category: 'toys',
      price: 285,
      quantity: 1,
      imageUrl: 'assets/images/super-games.png'
    }
  ];
  increment(item: CartItem) {
    item.quantity++;
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  remove(item: CartItem) {
    this.cart = this.cart.filter(i => i.id !== item.id);
  }
}
