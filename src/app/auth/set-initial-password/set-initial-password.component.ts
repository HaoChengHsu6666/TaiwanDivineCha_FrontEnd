// src/app/auth/set-initial-password/set-initial-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-set-initial-password',
  templateUrl: './set-initial-password.component.html',
  styleUrls: ['./set-initial-password.component.scss']
})
export class SetInitialPasswordComponent implements OnInit {
  setPasswordForm!: FormGroup;
  token: string | null = null;
  isLoading: boolean = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.message = '無效的設定密碼連結。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        this.setPasswordForm.disable(); // 禁用表單
      }
    });

    this.setPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8), // 至少8位
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // 包含大小寫字母、數字和特殊字符
      ]],
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
    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      this.snackBar.open('請檢查密碼欄位。', '關閉', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    if (!this.token) {
      this.message = '無效的設定密碼連結。';
      this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }

    this.isLoading = true;
    this.message = '';

    const { newPassword } = this.setPasswordForm.value;

    this.authService.setInitialPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.message = response.message || '您的密碼已成功設定！';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['success-snackbar'] });
        this.isLoading = false;
        // 設定成功後，導航到註冊成功頁面，可以提示用戶現在可以登入
        this.router.navigate(['/registration-success'], { queryParams: { activated: true } });
      },
      error: (error) => {
        this.message = error.message || '設定密碼失敗，連結可能已過期或無效。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    });
  }

  get newPasswordControl() {
    return this.setPasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.setPasswordForm.get('confirmPassword');
  }
}