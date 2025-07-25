import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../core/services/cart.service'; // Import CartService
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatDialog } from '@angular/material/dialog';
import { ProductOptionsComponent } from '../product-options/product-options.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products$: Observable<Product[]> = new Observable<Product[]>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService, // Inject CartService
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private dialog: MatDialog // Inject MatDialog
  ) { }

  ngOnInit(): void {
    this.products$ = this.route.queryParamMap.pipe(
      switchMap(params => {
        const category = params.get('category');
        const searchTerm = params.get('q');

        if (category) {
          return this.productService.getProductsByCategory(category);
        } else if (searchTerm) {
          const lowerCaseTerm = searchTerm.toLowerCase();
          return this.productService.getProducts().pipe(
            switchMap(allProducts => {
              const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(lowerCaseTerm) ||
                product.category.toLowerCase().includes(lowerCaseTerm) ||
                (product.description && product.description.toLowerCase().includes(lowerCaseTerm))
              );
              return of(filtered);
            })
          );
        } else {
          return this.productService.getProducts();
        }
      })
    );
  }

  openOptionsDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductOptionsComponent, {
      width: '400px',
      data: { product: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToCart(result.product, result.quantity, result.weight);
      }
    });
  }

  addToCart(product: Product, quantity: number, weight: number): void {
    if (!product.id) {
      this.snackBar.open('商品ID缺失，無法加入購物車', '關閉', { duration: 3000 });
      return;
    }

    if (product.stock === 0) {
      this.snackBar.open('商品已售罄', '關閉', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(product.id, quantity, weight).subscribe({
      next: () => {
        this.snackBar.open('已加入購物車', '關閉', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        this.snackBar.open('加入購物車失敗，請先登入', '關閉', { duration: 3000 });
      }
    });
  }
}