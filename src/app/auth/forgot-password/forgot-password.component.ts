// src/app/auth/forgot-password/forgot-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, take } from 'rxjs/operators';
// 移除 MatDialog 和 AuthModalComponent 的導入，因為現在是獨立頁面
// import { MatDialog } from '@angular/material/dialog';
// import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // 添加加載狀態

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    // private dialog: MatDialog // 移除
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['',
        [Validators.required, Validators.email],
        [this.emailExistsValidator()] // 非同步驗證器
      ]
    });
  }

  // 自定義非同步驗證器：檢查 Email 是否已存在（重設密碼需要 Email 存在）
  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email || !Validators.email(control)) {
        return of(null);
      }

      this.isLoading = true; // 開始加載
      return this.authService.checkEmailExists(email).pipe(
        debounceTime(500),
        take(1),
        map(exists => {
          this.isLoading = false; // 結束加載
          // 如果 exists 為 false，表示 Email 未註冊，則驗證失敗 (返回 { emailNotRegistered: true })
          return exists ? null : { emailNotRegistered: true };
        }),
        catchError(() => {
          this.isLoading = false; // 結束加載
          return of(null); // 捕獲錯誤，避免驗證器崩潰，並視為成功 (或根據需求處理錯誤狀態)
        })
      );
    };
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      this.snackBar.open('請檢查 Email 欄位。', '關閉', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    this.isLoading = true; // 設置加載狀態

    const email = this.forgotPasswordForm.get('email')?.value;

    this.authService.sendResetPasswordEmail(email).subscribe({
      next: (response) => {
        this.successMessage = response.message || '重設密碼連結已發送到您的 Email，請檢查收件箱。';
        this.snackBar.open(this.successMessage, '關閉', { duration: 5000, panelClass: ['success-snackbar'] });
        this.forgotPasswordForm.reset(); // 清空表單
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || '發送請求失敗，請稍後再試。';
        this.snackBar.open(this.errorMessage, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    });
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
}