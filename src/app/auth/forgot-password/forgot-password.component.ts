import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, timer} from 'rxjs';
import { map, catchError, debounceTime, take, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

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
    private dialog: MatDialog 
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['',
        [Validators.required, Validators.email],
        // 這個驗證器現在應該檢查 Email 是否存在且**已驗證**
        [this.emailExistsAndVerifiedValidator()] // 非同步驗證器
      ]
    });
  }

  // 自定義非同步驗證器：檢查 Email 是否已存在（重設密碼需要 Email 存在）
  emailExistsAndVerifiedValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email || control.invalid) { // 如果 Email 為空或格式無效，直接返回 null
        return of(null);
      }

      // 注意：這裡的 `checkEmailExists` API 可能需要後端擴展，
      // 以便前端能判斷 Email 是否存在「且已驗證」。
      // 如果後端 `checkEmailExists` 不包含「驗證」狀態，那麼這個非同步驗證器會難以精確實現。
      // 在這種情況下，Email 驗證的錯誤會在 `onSubmit` 階段，由後端發送重設郵件時返回。
      // 為了安全，即使 Email 已註冊但未驗證，後端也可能返回成功的假象，以避免 Email 枚舉攻擊。
      // 因此，這裡的 `emailExistsAndVerifiedValidator` 僅檢查 Email 格式和是否存在。
      // 真正的「是否已驗證」的檢查和錯誤回饋會發生在 `onSubmit` 呼叫 `sendResetPasswordEmail` 後。

      return timer(500).pipe( // 防抖 500 毫秒
        switchMap(() => this.authService.checkEmailExists(email)), // 假設這個 API 仍然只檢查存在
        map(exists => {
          // 如果 Email 不存在 (exists 為 false)，則返回錯誤
          return exists ? null : { emailNotFoundOrUnverified: true }; // 修改錯誤名稱
        }),
        catchError(() => {
          // 如果檢查 Email API 失敗，默認視為 Email 不存在或不可用
          return of({ emailNotFoundOrUnverified: true }); // 修改錯誤名稱
        }),
        take(1)
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

  // 新增一個方法來導航回登入模態框
  goToLogin(): void {
    this.router.navigate(['/']).then(() => { // 導航回根路徑或您打開 AuthModal 的路徑
      this.dialog.open(AuthModalComponent, {
        data: { selectedTabIndex: 0 } // 打開登入頁籤
      });
    });
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
}