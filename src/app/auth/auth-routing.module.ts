import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';

const routes: Routes = [
  
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'reset-password/:token', component: ResetPasswordComponent }, // 帶有 token 參數的重設密碼頁
        { path: 'activate-account/:token', component: ActivateAccountComponent }, // 郵件中的激活連結導向此處
        { path: 'registration-success', component: RegistrationSuccessComponent }, // 註冊成功後的提示頁面
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }