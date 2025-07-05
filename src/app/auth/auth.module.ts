// src/app/auth/auth.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // **導入 ReactiveFormsModule** 做登入/註冊表單響應式表單

import { AuthRoutingModule } from './auth-routing.module';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'; // 之前修正 ForgotPasswordComponent 用的
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';


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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AuthModalComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ActivateAccountComponent,
    RegistrationSuccessComponent,
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
    // 通常無需在此處 export。但如果 ForgotPasswordComponent 等也希望被其他模組直接使用，可以考慮 export。
  ]
})
export class AuthModule { }