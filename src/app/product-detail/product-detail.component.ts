import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CartService } from '../core/services/cart.service'; // Import CartService
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<Product | undefined> = EMPTY;
  quantity: number = 1; // Default quantity for adding to cart
  selectedWeight: number = 600; // Default weight to one jin
  basePrice: number = 0;
  displayPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cartService: CartService, // Inject CartService
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        if (productId) {
          return this.productService.getProductById(productId);
        }
        return EMPTY;
      }),
      tap(product => {
        if (product) {
          this.basePrice = product.price;
          this.calculatePrice();
        }
      })
    );
  }

  calculatePrice(): void {
    let multiplier = 1;
    if (this.selectedWeight === 300) {
      multiplier = 0.5;
    } else if (this.selectedWeight === 150) {
      multiplier = 0.25;
    }
    this.displayPrice = Math.round(this.basePrice * multiplier);
  }

  closeProductDetail(): void {
    this.location.back();
  }

  addToCart(product: Product): void {
    if (!product.id) {
      this.snackBar.open('商品ID缺失，無法加入購物車', '關閉', { duration: 3000 });
      return;
    }

    if (this.quantity <= 0) {
      this.snackBar.open('數量必須大於0', '關閉', { duration: 3000 });
      return;
    }

    if (product.stock !== undefined && this.quantity > product.stock) {
      this.snackBar.open('庫存不足', '關閉', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(product.id, this.quantity, this.selectedWeight).subscribe({
      next: () => {
        this.snackBar.open('已加入購物車', '關閉', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        this.snackBar.open('加入購物車失敗，請先登入', '關閉', { duration: 3000 });
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
