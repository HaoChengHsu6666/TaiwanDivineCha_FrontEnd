// src/app/auth/auth-modal/auth-modal.component.ts

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'; // 用於導航到忘記密碼頁面

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  selectedTabIndex: number = 0; // 0 for Login, 1 for Register

  constructor(
    public dialogRef: MatDialogRef<AuthModalComponent>,
    private router: Router
  ) { }

  onNoClick(): void {
    this.dialogRef.close(); // 關閉對話框
  }

  // 當 Login 組件觸發 'forgotPassword' 事件時，導航到忘記密碼頁面並關閉模態框
  navigateToForgotPassword(): void {
    this.dialogRef.close(); // 先關閉登入/註冊模態框
    this.router.navigate(['/forgot-password']); // 導航到忘記密碼路由
  }
}