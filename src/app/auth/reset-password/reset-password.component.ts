// src/app/auth/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // 確保路徑正確
import { MatSnackBar } from '@angular/material/snack-bar'; // 用於顯示提示訊息

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
    private snackBar: MatSnackBar // 注入 MatSnackBar
  ) { }

  ngOnInit(): void {
    // 從路由中獲取 token
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.message = '無效的重設密碼連結。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        // 可以考慮將用戶導向錯誤頁面或忘記密碼頁面
        // this.router.navigate(['/auth/forgot-password']);
      }
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator // 添加自定義驗證器
    });
  }

  // 自定義驗證器：檢查兩次密碼是否一致
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
      this.resetPasswordForm.markAllAsTouched(); // 觸發所有欄位的驗證訊息顯示
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
        this.router.navigate(['/auth/login']); // 重設成功後導向登入頁面
      },
      error: (error) => {
        this.isLoading = false;
        // 假設後端錯誤會返回一個 error.message
        this.message = error.error?.message || '重設密碼失敗。請稍後再試或重新申請連結。';
        console.error('Reset password error:', error);
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }
}