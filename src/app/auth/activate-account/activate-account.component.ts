import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  message: string = '帳戶激活中...';
  isLoading: boolean = true;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (this.token) {
        this.activateAccount(this.token);
      } else {
        this.message = '無效的激活連結。';
        this.isLoading = false;
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  activateAccount(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.message = response.message || '您的帳戶已成功激活！';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['success-snackbar'] });
        this.isLoading = false;
        // 激活成功後，導航到設定初始密碼頁面
        this.router.navigate(['/set-initial-password', token]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Account activation failed:', error);
        this.message = error.message || '帳戶激活失敗或連結已過期。';
        this.snackBar.open(this.message, '關閉', { duration: 5000, panelClass: ['error-snackbar'] });
        // 激活失敗，可以選擇導航回主頁或顯示錯誤訊息
        this.router.navigate(['/']); // 或者到一個特定的錯誤頁面
      }
    });
  }
}
