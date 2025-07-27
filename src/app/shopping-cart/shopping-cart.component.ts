import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { Cart } from '../core/models/cart.model';
import { CartItem } from '../core/models/cart-item.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart | undefined;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 0) {
      return; // Prevent negative quantity
    }
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: () => {
        this.loadCart(); // Reload cart to reflect changes
      },
      error: (err) => {
        console.error('Failed to update cart item', err);
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart to reflect changes
      },
      error: (err) => {
        console.error('Failed to remove cart item', err);
      }
    });
  }

  onCheckoutClick(): void {
    this.router.navigate(['/checkout']);
  }
}
