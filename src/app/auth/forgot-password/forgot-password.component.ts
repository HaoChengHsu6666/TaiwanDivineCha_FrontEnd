// src/app/auth/forgot-password/forgot-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; // 導入 Router
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog'; // 導入 MatDialog
import { AuthModalComponent } from '../auth-modal/auth-modal.component'; // 導入 AuthModalComponent

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog // 注入 MatDialog
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['',
        [Validators.required, Validators.email],
        [this.emailExistsValidator()] // 異步驗證器，檢查 Email 是否已註冊
      ]
    });
  }

  // 異步驗證器：檢查 Email 是否已註冊
  // 需求：Email 必須是 "已註冊過" 的，才能發送重設密碼信
  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email || control.hasError('email')) { // 如果 Email 為空或格式不正確，則不執行後續驗證
        return of(null);
      }

      // debounceTime 避免每次按鍵都觸發請求
      return this.authService.checkEmailExists(email).pipe(
        debounceTime(500), // 等待 500ms 後再發送請求
        take(1),           // 只取第一個結果
        map(exists => {
          // 如果 exists 為 true，表示 Email 已註冊，則驗證通過 (返回 null)
          // 如果 exists 為 false，表示 Email 未註冊，則驗證失敗 (返回 { emailNotRegistered: true })
          return exists ? null : { emailNotRegistered: true };
        }),
        catchError(() => of(null)) // 捕獲錯誤，避免驗證器崩潰，並視為成功 (或根據需求處理錯誤狀態)
      );
    };
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched(); // 標記所有欄位為 touched，顯示錯誤訊息
      this._snackBar.open('請檢查 Email 欄位。', '關閉', { duration: 3000 });
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value;

    // 調用 AuthService 發送重設密碼 Email
    this.authService.sendResetPasswordEmail(email).subscribe(
      response => {
        this.successMessage = '重設密碼連結已發送到您的 Email，請檢查收件箱。';
        this._snackBar.open(this.successMessage, '關閉', { duration: 5000 });
        this.forgotPasswordForm.reset(); // 清空表單
      },
      error => {
        this.errorMessage = error.message || '發送請求失敗，請稍後再試。';
        this._snackBar.open(this.errorMessage, '關閉', { duration: 5000, panelClass: ['snackbar-error'] });
      }
    );
  }

  goToLogin(): void {
    // 關閉當前頁面 (如果這個組件被嵌入到特定路由中，就直接導航)
    // 然後打開登入模態框
    this.router.navigate(['/']); // 或者其他您希望的基礎路由
    this.dialog.open(AuthModalComponent, {
      width: '500px',
      panelClass: 'auth-modal-panel',
      data: { selectedTab: 0 } // 可以傳遞資料讓 AuthModalComponent 自動選擇登入頁籤
    });
  }
}