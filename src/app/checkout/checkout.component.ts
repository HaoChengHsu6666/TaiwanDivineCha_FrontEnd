import { StoreSelectionModalComponent } from '../store-selection-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../core/services/order.service';
import { CartService } from '../core/services/cart.service';
import { Cart } from '../core/models/cart.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart!: Cart;
  checkoutForm!: FormGroup;
  deliveryMethod: 'delivery' | 'pickup' = 'delivery';

  constructor(private fb: FormBuilder, private cartService: CartService, private orderService: OrderService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      deliveryMethod: ['delivery', Validators.required],
      // 宅配到府的表單控制項
      deliveryDetails: this.fb.group({
        recipientName: ['', Validators.required],
        recipientEmail: ['', [Validators.required, Validators.email]],
        recipientPhone: ['', Validators.required],
        deliveryAddress: ['', Validators.required],
        deliveryNotes: ['']
      }),
      // 超商取貨的表單控制項
      pickupDetails: this.fb.group({
        recipientName: ['', Validators.required],
        recipientEmail: ['', [Validators.required, Validators.email]],
        recipientPhone: ['', Validators.required],
        pickupStore: ['', Validators.required],
        deliveryNotes: ['']
      }),
      paymentMethod: ['', Validators.required],
      // ATM轉帳的表單控制項
      atmPayment: this.fb.group({
        bank: ['', Validators.required],
        accountNumber: ['', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      }),
      // 信用卡付款的表單控制項
      creditCardPayment: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        cardCode: [''],
        cardNumber: ['', Validators.required],
        cardExpiry: ['', Validators.required],
        cardCvc: ['', Validators.required]
      })
    });

    this.loadCart();

    // 監聽寄送方式的變化
    this.checkoutForm.get('deliveryMethod')?.valueChanges.subscribe(value => {
      this.deliveryMethod = value;
      this.updateValidators(value);
    });
    this.updateValidators(this.deliveryMethod);
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

  // 更新驗證器
  updateValidators(deliveryMethod: string) {
    const deliveryDetails = this.checkoutForm.get('deliveryDetails');
    const pickupDetails = this.checkoutForm.get('pickupDetails');
    const paymentMethod = this.checkoutForm.get('paymentMethod');

    if (deliveryDetails && pickupDetails && paymentMethod) {
      if (deliveryMethod === 'delivery') {
        deliveryDetails.enable();
        pickupDetails.disable();
        paymentMethod.enable();
      } else if (deliveryMethod === 'pickup') {
        deliveryDetails.disable();
        pickupDetails.enable();
        paymentMethod.setValue('pickupPay');
        paymentMethod.disable();
      } else {
        deliveryDetails.disable();
        pickupDetails.disable();
        paymentMethod.disable();
      }
    }
  }

  // 提交訂單
  submitOrder() {
    if (this.checkoutForm.valid) {
      const orderData = this.checkoutForm.value;
      this.orderService.createOrder(orderData).subscribe({
        next: (response) => {
          // 在這裡處理訂單建立成功後的邏輯，例如導向到訂單成功頁面
        },
        error: (err) => {
          console.error('Failed to create order', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  // 標記所有控制項為已觸碰
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  openStoreSelection(): void {
    const dialogRef = this.dialog.open(StoreSelectionModalComponent, {
      width: '400px',
      disableClose: true // 防止點擊外部關閉
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 將選擇的門市資訊填入表單
        this.checkoutForm.get('pickupDetails')?.get('pickupStore')?.setValue(`${result.name} (${result.address})`);
      }
    });
  }
}