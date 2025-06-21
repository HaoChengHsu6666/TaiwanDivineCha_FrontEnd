import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component'; // 稍後用到
// import { ActivationSuccessComponent } from './activation-success/activation-success.component'; // 稍後用到

const routes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'reset-password/:token', component: ResetPasswordComponent }, // 帶有 token 參數的重設密碼頁
  // { path: 'activate-account/:token', component: ActivationSuccessComponent }, // 帳號開通成功頁
  // { path: 'auth', component: AuthModalComponent } // AuthModalComponent 通常不會有獨立路由，而是透過 MatDialog 開啟
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }