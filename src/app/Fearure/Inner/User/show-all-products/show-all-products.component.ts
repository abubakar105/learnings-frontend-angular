import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCardComponent } from "./product-card/product-card.component";

@Component({
  selector: 'app-show-all-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './show-all-products.component.html',
  styleUrl: './show-all-products.component.css'
})
export class ShowAllProductsComponent {
products: any[] = [
     {
      name: 'Retro Controller',
      price: 199,
      originalPrice: 249,
      rating: 4,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlrod7F8Vz0ezWmt_id0rzf4sR4BGvGsIIkA&s'
    },
    {
      name: 'Vintage Headphones',
      price: 89,
      originalPrice: 120,
      rating: 5,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Headphones'
    },
    {
      name: 'Arcade Machine',
      price: 799,
      originalPrice: 899,
      rating: 3,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Arcade+Machine'
    },
    {
      name: 'Gaming Chair',
      price: 150,
      originalPrice: 200,
      rating: 4,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Gaming+Chair'
    },
    {
      name: 'LED Monitor',
      price: 299,
      originalPrice: 349,
      rating: 5,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=LED+Monitor'
    },
    {
      name: 'Mechanical Keyboard',
      price: 120,
      originalPrice: 150,
      rating: 4,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Mechanical+Keyboard'
    },
    {
      name: 'Gaming Mouse',
      price: 60,
      originalPrice: 80,
      rating: 4,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Gaming+Mouse'
    },
    {
      name: 'Mouse Pad',
      price: 20,
      originalPrice: 25,
      rating: 3,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Mouse+Pad'
    },
    {
      name: 'VR Headset',
      price: 399,
      originalPrice: 499,
      rating: 5,
      imageUrl: 'https://via.placeholder.com/300x200.png?text=VR+Headset'
    }
  ];
}
