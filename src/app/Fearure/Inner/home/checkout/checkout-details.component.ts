import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BillingAndAddressComponent } from "./billing-and-address/billing-and-address.component";
import { CartComponent } from "./cart/cart.component";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-checkout-details',
  standalone: true,
  imports: [CommonModule, BillingAndAddressComponent, CartComponent],
  templateUrl: './checkout-details.component.html',
  styleUrl: './checkout-details.component.css'
})
export class CheckoutDetailsComponent {
 steps = ['Cart', 'Billing & address', 'Payment'];
  currentStep = 0;

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

  get subTotal(): number {
    return 20
  }

  get discountAmount(): number {
    return this.subTotal * 0.05;
  }

  get total(): number {
    return this.subTotal - this.discountAmount;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

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
