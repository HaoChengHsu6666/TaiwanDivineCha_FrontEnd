import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../core/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ProductOptionsComponent {

  selectedWeight: number | undefined;
  quantity = 1;

  constructor(
    public dialogRef: MatDialogRef<ProductOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private snackBar: MatSnackBar
  ) { }

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