import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  iconUrl?: string;
}
@Component({
  selector: 'app-billing-and-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-and-address.component.html',
  styleUrls: ['./billing-and-address.component.css']
})
export class BillingAndAddressComponent {
showPaymentOptions :boolean = false;
  options: PaymentOption[] = [
    {
      id: 'paypal',
      label: 'Pay with PayPal',
      description: 'You will be redirected to PayPal website to complete your purchase securely.',
      iconUrl: 'https://bootstrapdemos.adminmart.com/matdash/dist/assets/images/svgs/paypal.svg'
    },
    {
      id: 'card',
      label: 'Credit / Debit Card',
      description: 'We support Mastercard, Visa, Discover and Stripe.',
      iconUrl: 'https://bootstrapdemos.adminmart.com/matdash/dist/assets/images/svgs/mastercard.svg'
    },
    {
      id: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay with cash when your order is delivered.'
    }
  ];

  selectedId = this.options[0].id;

  onSelect(option: PaymentOption) {
    this.selectedId = option.id;
    this.showPaymentOptions = false;
  }
  onShowPaymentOptions() {
    this.showPaymentOptions=true;
  }
}
