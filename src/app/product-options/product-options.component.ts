import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../core/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ProductOptionsComponent implements OnInit {

  selectedWeight: number = 600; // Default weight to one jin
  quantity = 1;
  basePrice: number = 0;
  displayPrice: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.basePrice = this.data.product.price;
    this.calculatePrice();
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.selectedWeight) {
      this.snackBar.open('請選擇重量', '關閉', { duration: 3000 });
      return;
    }

    if (this.quantity <= 0) {
      this.snackBar.open('數量必須大於0', '關閉', { duration: 3000 });
      return;
    }

    this.dialogRef.close({
      product: this.data.product,
      quantity: this.quantity,
      weight: this.selectedWeight
    });
  }
}
