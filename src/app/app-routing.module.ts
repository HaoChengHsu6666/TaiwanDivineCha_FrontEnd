import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // 導入 HomeComponent
// import { ContactComponent } from './contact/contact.component'; // 如果您有聯絡我們頁面
// import { AboutComponent } from './about/about.component'; // 如果您有關於好神頁面
import { ProductListComponent } from './product-list/product-list.component'; // 導入 ProductListComponent
import { ProductDetailComponent } from './product-detail/product-detail.component'; // 導入 ProductDetailComponent
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent }, // 所有商品列表 (來品神茶主頁)
  { path: 'products/category/:category', component: ProductListComponent }, // 按分類篩選 (如果需要更精確路由)
  { path: 'product/:id', component: ProductDetailComponent }, // 商品細節頁
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'about', component: AboutComponent },
  // ... 其他路由
  { path: '**', redirectTo: '' } // 捕獲所有未定義路由並重定向到首頁
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }