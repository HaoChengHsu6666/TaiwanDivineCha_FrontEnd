// src/app/auth/auth-modal/auth-modal.component.ts (修正和優化)

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog'; // MatDialog 如果 AuthModalComponent 內部沒有開其他dialog可以移除
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms'; // 確保導入 AbstractControl
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError, debounceTime, take } from 'rxjs/operators';

export interface AuthDialogData {
  selectedTabIndex: number; // 0 for Login, 1 for Register
}

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {
  selectedTabIndex: number;

  loginForm!: FormGroup; // 確保在 ngOnInit 中初始化
  loginLoading: boolean = false;

  registerForm!: FormGroup; // 確保在 ngOnInit 中初始化
  registerLoading: boolean = false;

  captchaImageUrl: string = ''; // 用於儲存驗證碼圖片的 URL

  constructor(
    public dialogRef: MatDialogRef<AuthModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedTabIndex: number },
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    // private dialog: MatDialog // 如果 AuthModalComponent 內部沒有直接打開其他 MatDialog，可以考慮移除
  ) {
    this.selectedTabIndex = data.selectedTabIndex;
  }

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegisterForm();
    this.refreshCaptcha(); // 初始化時獲取驗證碼
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captcha: ['', [Validators.required]]
    });
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      email: ['',
        [Validators.required, Validators.email],
        [this.emailExistsValidator()]
      ]
    });
  }

  // 輔助獲取表單控制項的方法
  get loginEmailControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get loginPasswordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get registerEmailControl(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      return timer(500).pipe( // 防抖 500 毫秒
        switchMap(() => {
          if (!control.value) { // 檢查值是否為空，如果是空則不發送請求
            return of(null);
          }
          return this.authService.checkEmailExists(control.value);
        }),
        map(exists => {
          return exists ? { emailTaken: true } : null;
        }),
        catchError(() => of(null)),
        take(1)
      );
    };
  }

  // 獲取並刷新驗證碼圖片
  refreshCaptcha(): void {
    this.authService.getCaptchaImageUrl().subscribe({
      next: (imageUrl) => {
        // 確保這裡接收到的 imageUrl 是有效的圖片 URL
        // 例如：'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
        // 或者一個實際的圖片路徑，如 '/api/captcha/some_id.png'
        if (imageUrl) {
          this.captchaImageUrl = imageUrl;
          this.loginForm.get('captcha')?.setValue(''); // 清空驗證碼輸入框
        } else {
          console.warn('Captcha image URL is empty or null.');
          this.snackBar.open('未能獲取驗證碼圖片。', '關閉', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Failed to load captcha:', err);
        this.snackBar.open('無法加載驗證碼，請檢查網路或稍後再試。', '關閉', { duration: 3000 });
        this.captchaImageUrl = ''; // 設置為空，防止顯示破圖
      }
    });
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.snackBar.open('請檢查所有必填欄位。', '關閉', { duration: 3000 });
      this.refreshCaptcha(); // 登入失敗或表單無效時刷新驗證碼
      return;
    }

    this.loginLoading = true;
    const credentials = this.loginForm.value; // 直接獲取整個物件

    // 將整個 credentials 物件作為單一參數傳遞給 authService.login
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loginLoading = false;
        this.snackBar.open('登入成功！', '關閉', { duration: 3000 });
        this.dialogRef.close(true);
        // this.router.navigate(['/profile']); // 如果需要登入後導航
      },
      error: (error) => {
        this.loginLoading = false;
        console.error('Login error:', error);
        // 嘗試從 error.error.message 獲取後端返回的具體錯誤訊息
        const errorMessage = error.error?.message || error.message || '登入失敗，請檢查電子郵件、密碼或驗證碼。';
        this.snackBar.open(errorMessage, '關閉', { duration: 5000 });
        this.refreshCaptcha(); // 登入失敗時刷新驗證碼
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.snackBar.open('請檢查電子郵件欄位。', '關閉', { duration: 3000 });
      return;
    }

    this.registerLoading = true;
    const email = this.registerForm.get('email')?.value;

    this.authService.register(email).subscribe({
      next: (response) => {
        this.registerLoading = false;
        this.snackBar.open('註冊成功！請檢查您的電子郵件以激活帳戶。', '關閉', { duration: 5000 });
        this.registerForm.reset();
        this.selectedTabIndex = 0; // 切換回登入頁籤
      },
      error: (error) => {
        this.registerLoading = false;
        console.error('Register error:', error);
        const errorMessage = error.error?.message || error.message || '註冊失敗，請稍後再試。';
        this.snackBar.open(errorMessage, '關閉', { duration: 5000 });
      }
    });
  }

  goToForgotPassword(): void {
    this.dialogRef.close(); // 關閉當前模態框
    this.router.navigate(['/forgot-password']); // 導航到忘記密碼頁面
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}