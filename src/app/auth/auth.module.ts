// src/app/auth/auth.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // **導入 ReactiveFormsModule** 做登入/註冊表單響應式表單

import { AuthRoutingModule } from './auth-routing.module';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
// import { LoginComponent } from './login/login.component'; // 尚未創建，稍後創建
// import { RegisterComponent } from './register/register.component'; // 尚未創建，稍後創建
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'; // 尚未創建，稍後創建
// import { ResetPasswordComponent } from './reset-password/reset-password.component'; // 尚未創建，稍後創建
// import { ActivationSuccessComponent } from './activation-success/activation-success.component'; // 尚未創建，稍後創建
// import { LoginComponent } from './login/login.component'; // **用於提示訊息 (如登入失敗)**
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'; // 之前修正 ForgotPasswordComponent 用的


// Angular Material 模組
import { MatDialogModule } from '@angular/material/dialog'; // 導入 MatDialogModule (for mat-dialog-content)
import { MatButtonModule } from '@angular/material/button'; // 通常 dialog 也會用 button
import { MatIconModule } from '@angular/material/icon';     // 導入 MatIconModule (for mat-icon)
import { MatTabsModule } from '@angular/material/tabs';     // 導入 MatTabsModule (for mat-tab-group, mat-tab)
import { MatInputModule } from '@angular/material/input';   // 登入/註冊表單可能會用到
import { MatFormFieldModule } from '@angular/material/form-field'; // 登入/註冊表單可能會用到
import { MatCheckboxModule } from '@angular/material/checkbox'; // 登入表單的記住我
import { MatSnackBarModule } from '@angular/material/snack-bar'; // 用於提示訊息
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- 如果使用 mat-spinner


@NgModule({
  declarations: [
    AuthModalComponent,
    // LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    // RegisterComponent, // 稍後創建
    // ResetPasswordComponent, // 稍後創建
    // ActivationSuccessComponent // 稍後創建
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule, // **重要：表單驗證**

    // Material Modules
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule
  
  ],
  exports: [
    // 如果 AuthModalComponent 僅通過 MatDialog 開啟，則無需 export
    // 如果 LoginComponent 和 RegisterComponent 也需要在其他模組中直接使用，則需要 export
  ]
})
export class AuthModule { }