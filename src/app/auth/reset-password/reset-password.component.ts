// src/app/auth/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  token: string | null = null;
  isLoading: boolean = false;
  message: string = ''; // 用於顯示成功或失敗訊息

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // 從路由中獲取 token
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.message = '無效的重設密碼連結。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        // 如果沒有 token，可以禁用表單或重定向
        this.resetPasswordForm.disable();
      }
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]], // 至少8位，包含大小寫字母、數字和特殊字符
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // 自定義驗證器：檢查密碼是否匹配
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  };

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      this.snackBar.open('請檢查密碼欄位。', '關閉', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    if (!this.token) {
      this.message = '重設密碼連結已失效或不存在。';
      this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }

    this.isLoading = true;
    this.message = ''; // 清空之前的訊息

    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.message = response.message || '密碼已成功重設！請使用新密碼登入。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['success-snackbar'] });
        this.isLoading = false;
        this.router.navigate(['/']); // 重設成功後導航到首頁，或可以引導用戶重新打開 AuthModalComponent 到登入頁籤
        // this.dialog.open(AuthModalComponent, { data: { selectedTabIndex: 0 } }); // 或者這樣
      },
      error: (error) => {
        this.message = error.message || '重設密碼失敗，連結可能已過期或無效。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    });
  }

  get newPasswordControl() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.resetPasswordForm.get('confirmPassword');
  }
}