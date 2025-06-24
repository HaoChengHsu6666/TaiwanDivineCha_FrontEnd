import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // 導入 HomeComponent
import { ProductListComponent } from './product-list/product-list.component'; // 導入 ProductListComponent
import { ProductDetailComponent } from './product-detail/product-detail.component'; // 導入 ProductDetailComponent
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component'; // 用於 Email 激活
import { SetInitialPasswordComponent } from './auth/set-initial-password/set-initial-password.component'; // 用於初始密碼設定
import { RegistrationSuccessComponent } from './auth/registration-success/registration-success.component'; // 用於註冊成功提示頁


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent }, // 所有商品列表 (來品神茶主頁)
  { path: 'products/category/:category', component: ProductListComponent }, // 按分類篩選 (如果需要更精確路由)
  { path: 'product/:id', component: ProductDetailComponent }, // 商品細節頁
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'activate-account/:token', component: ActivateAccountComponent }, // 郵件中的激活連結導向此處
  { path: 'set-initial-password/:token', component: SetInitialPasswordComponent }, // 激活後設定初始密碼
  { path: 'registration-success', component: RegistrationSuccessComponent }, // 註冊成功後的提示頁面
  { path: '**', redirectTo: '' } // 捕獲所有未定義路由並重定向到首頁
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }