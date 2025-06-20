// src/app/auth/auth.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // **導入 ReactiveFormsModule**

import { AuthRoutingModule } from './auth-routing.module';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
// import { LoginComponent } from './login/login.component'; // 尚未創建，稍後創建
// import { RegisterComponent } from './register/register.component'; // 尚未創建，稍後創建
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'; // 尚未創建，稍後創建
// import { ResetPasswordComponent } from './reset-password/reset-password.component'; // 尚未創建，稍後創建
// import { ActivationSuccessComponent } from './activation-success/activation-success.component'; // 尚未創建，稍後創建
import { LoginComponent } from './login/login.component'; // **用於提示訊息 (如登入失敗)**


// Angular Material 模組
import { MatDialogModule } from '@angular/material/dialog'; // **用於模態框**
import { MatTabsModule } from '@angular/material/tabs';     // **用於頁籤**
import { MatInputModule } from '@angular/material/input';   // **用於輸入框**
import { MatFormFieldModule } from '@angular/material/form-field'; // **用於表單欄位**
import { MatButtonModule } from '@angular/material/button'; // **用於按鈕**
import { MatIconModule } from '@angular/material/icon';     // **用於圖示**
import { MatCheckboxModule } from '@angular/material/checkbox'; // **用於保持登入**
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AuthModalComponent,
    LoginComponent,
    // LoginComponent, // 稍後創建
    // RegisterComponent, // 稍後創建
    // ForgotPasswordComponent, // 稍後創建
    // ResetPasswordComponent, // 稍後創建
    // ActivationSuccessComponent // 稍後創建
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule, // **重要：表單驗證**

    // Material Modules
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  exports: [
    // 如果 AuthModalComponent 僅通過 MatDialog 開啟，則無需 export
    // 如果 LoginComponent 和 RegisterComponent 也需要在其他模組中直接使用，則需要 export
  ]
})
export class AuthModule { }