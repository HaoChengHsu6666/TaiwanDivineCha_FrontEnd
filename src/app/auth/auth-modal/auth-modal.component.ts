import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog'; // MatDialog 如果 AuthModalComponent 內部沒有開其他dialog可以移除
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms'; // 確保導入 AbstractControl
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router'; // 導入 ActivatedRoute
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

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

  loginForm!: FormGroup; 
  loginLoading: boolean = false;

  registerForm!: FormGroup; 
  registerLoading: boolean = false
  registrationSuccess: boolean = false; // <-- 新增：註冊成功狀態

  captchaImageUrl: string = ''; // 用於儲存驗證碼圖片的 URL
  private returnUrl: string;

  constructor(
    public dialogRef: MatDialogRef<AuthModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedTabIndex: number },
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute // <-- 注入 ActivatedRoute
    // private dialog: MatDialog // 如果 AuthModalComponent 內部沒有直接打開其他 MatDialog，可以考慮移除
  ) {
    this.selectedTabIndex = data.selectedTabIndex;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        [this.emailNotRegisteredValidator ()]
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

  // emailNotRegisteredValidator  讓它適用於註冊 (檢查 Email 是否已被使用)
  emailNotRegisteredValidator (): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.valueChanges || control.pristine) {
        return of(null);
      }
      return timer(500).pipe( // 防抖 500 毫秒
        switchMap(() => this.authService.checkEmailExists(control.value)),
        map(exists => {
          // 如果 Email 存在 (exists 為 true)，則表示 Email 已被註冊，返回 'emailTaken' 錯誤
          return exists ? { emailTaken: true } : null;
        }),
        catchError(() => of(null)), // 遇到錯誤時，視為 Email 可用（避免阻礙註冊
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
    console.log('onLoginSubmit called.');
    if (this.loginForm.invalid) {
      console.log('Login form is invalid.', this.loginForm.errors);
      this.loginForm.markAllAsTouched();
      this.snackBar.open('請檢查所有必填欄位。', '關閉', { duration: 3000 });
      this.refreshCaptcha(); // 登入失敗或表單無效時刷新驗證碼
      return;
    }

    this.loginLoading = true;
    const credentials = this.loginForm.value; // 直接獲取整個物件
    console.log('Sending login credentials:', credentials);

    // 將整個 credentials 物件作為單一參數傳遞給 authService.login
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful! Response:', response);
        this.loginLoading = false;
        this.snackBar.open('登入成功！', '關閉', { duration: 3000 });
        this.dialogRef.close(true);
        this.router.navigateByUrl(this.returnUrl); // <-- 登入成功後導航
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginLoading = false;
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
        // 不再自動切換到登入頁籤，而是顯示成功訊息
        this.registrationSuccess = true; // <-- 設定註冊成功狀態
        this.snackBar.open('註冊成功！請檢查您的電子郵件，點擊連結以設定密碼並啟用帳戶。', '關閉', { duration: 5000 });
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

  // 用於非同步驗證，檢查電子郵件是否已存在
private emailTakenValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // 如果 Email 為空或無效，或沒有值，直接返回 null (不需要驗證)
    if (!control.value || control.invalid) {
      return of(null);
    }

    // 當前 Email 值
    const currentEmail = control.value;

      // 添加 debounceTime，在用戶停止輸入後延遲 500ms 才發送請求
      return timer(500).pipe( // <-- 關鍵的 debounceTime
        switchMap(() => this.authService.checkEmailExists(currentEmail)),
        map(exists => {
          // 如果 Email 存在，返回 'emailTaken' 錯誤
          if (exists) {
            return { emailTaken: true };
          }
          return null; // Email 不存在或可用
        }),
        catchError((error) => {
          console.error('Async email validation error:', error);
          // 如果後端 API 拋出錯誤，這裡也可以處理它，例如視為 Email 可用（暫時）
          // 或者根據實際錯誤類型返回不同的驗證錯誤
          return of(null); // 或者 { backendError: true }
        }),
        take(1) // 只取第一個發出的值並完成，防止記憶體洩漏
      );
    };
  }

}
