// src/app/auth/login/login.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service'; // 稍後創建
import { MatSnackBar } from '@angular/material/snack-bar'; // 用於顯示提示訊息

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // 使用 ! 告訴 TypeScript 會在 ngOnInit 中初始化
  hidePassword = true; // 控制密碼顯示/隱藏
  generatedCaptcha: string = ''; // 生成的驗證碼
  loginError: string = ''; // 登入失敗訊息

  @Output() forgotPassword = new EventEmitter<void>(); // 發送事件給父組件 (AuthModalComponent)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // 注入 AuthService
    private _snackBar: MatSnackBar // 注入 MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) // 英文大小寫與數字混和至少8碼
      ]],
      captcha: ['', Validators.required],
      rememberMe: [false] // 保持登入，預設不勾選
    });

    this.generateCaptcha(); // 初始化時生成驗證碼
  }

  // 檢查密碼格式是否有效 (helper for template errors)
  get passwordInvalid() {
    const passwordControl = this.loginForm.get('password');
    return passwordControl?.invalid && (passwordControl?.dirty || passwordControl?.touched);
  }

  // 生成六位數字英文不分大小寫的驗證碼
  generateCaptcha(): void {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedCaptcha = result;
    // 重置驗證碼輸入欄位和其驗證狀態
    this.loginForm.get('captcha')?.setValue('');
    this.loginForm.get('captcha')?.setErrors(null);
    this.loginForm.get('captcha')?.markAsUntouched(); // 避免立即顯示錯誤
  }

  // 驗證碼驗證器
  private captchaValidator(control: AbstractControl): { [key: string]: any } | null {
    const userInput = control.value;
    // 比較時不分大小寫 (因為需求說不分大小寫)
    if (userInput && this.generatedCaptcha && userInput.toLowerCase() !== this.generatedCaptcha.toLowerCase()) {
      return { 'incorrectCaptcha': true };
    }
    return null;
  }

  onLogin(): void {
    this.loginError = ''; // 清空之前的錯誤訊息

    // 重新檢查驗證碼的正確性，因為它是動態生成的
    this.loginForm.get('captcha')?.setValidators([Validators.required, this.captchaValidator.bind(this)]);
    this.loginForm.get('captcha')?.updateValueAndValidity(); // 強制重新驗證

    if (this.loginForm.invalid) {
      // 標記所有欄位為 touched，以顯示錯誤訊息
      this.loginForm.markAllAsTouched();
      this._snackBar.open('請檢查所有欄位是否正確填寫。', '關閉', { duration: 3000 });
      return;
    }

    const { email, password, captcha, rememberMe } = this.loginForm.value;

    // 再次驗證驗證碼
    if (captcha.toLowerCase() !== this.generatedCaptcha.toLowerCase()) {
      this.loginForm.get('captcha')?.setErrors({ 'incorrectCaptcha': true });
      this.loginError = '驗證碼錯誤，請重新輸入。';
      this.generateCaptcha(); // 驗證碼錯誤時重新生成
      return;
    }

    // 模擬後端登入請求
    this.authService.login(email, password).subscribe(
      response => {
        // 登入成功
        console.log('登入成功:', response);
        this._snackBar.open('登入成功！', '關閉', { duration: 3000 });
        this.loginForm.reset(); // 清空表單

        if (rememberMe) {
          // **重要：這裡只是示意。不應直接儲存帳號密碼。**
          // 通常會儲存一個登入標記或 token 的過期時間
          // localStorage.setItem('rememberMe', 'true');
          // localStorage.setItem('userEmail', email); // 不推薦儲存email，應儲存非敏感標記
          this._snackBar.open('已勾選保持登入。實際儲存機制由後端處理或前端儲存非敏感標記。', '關閉', { duration: 5000 });
        } else {
          // localStorage.removeItem('rememberMe');
          // localStorage.removeItem('userEmail');
        }

        // 登入成功後關閉對話框或導航到首頁
        // 由於 Login component 在 AuthModal 內部，它不能直接關閉 MatDialog
        // 模態框的關閉邏輯應該由 MatDialogRef 處理，通常在父組件 (AuthModalComponent) 中
        // 因此，登入成功後可以觸發一個事件或使用服務通知父組件關閉模態框。
        // 或者，在實際應用中，會由服務層處理 token，然後導航到應用程式主頁。
        // this.authService.closeAuthModal(); // 假設 AuthService 有一個方法來通知關閉模態框
      },
      error => {
        // 登入失敗
        console.error('登入失敗:', error);
        this.loginError = error.message || 'Email 或密碼不正確。'; // 顯示錯誤訊息
        this.generateCaptcha(); // 登入失敗時重新生成驗證碼
        this.loginForm.get('captcha')?.setValue(''); // 清空驗證碼欄位
      }
    );
  }

  onForgotPassword(): void {
    // 通知父組件 (AuthModalComponent) 切換到忘記密碼頁面
    this.forgotPassword.emit();
  }
}