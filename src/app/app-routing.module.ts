import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // 導入 HomeComponent
import { ProductListComponent } from './product-list/product-list.component'; // 導入 ProductListComponent
import { ProductDetailComponent } from './product-detail/product-detail.component'; // 導入 ProductDetailComponent
// import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  {
      path: '',
      // component: LayoutComponent, // 已使用app.module 宣告 LayoutComponent 作為頂層佈局，故此處不使用
      children: [
        { path: '', component: HomeComponent },
        { path: 'products', component: ProductListComponent }, // 所有商品列表 (來品神茶主頁)
        { path: 'products/category/:category', component: ProductListComponent }, // 按分類篩選 (如果需要更精確路由)
        { path: 'product/:id', component: ProductDetailComponent }, // 商品細節頁
      ] 
  },

  // *** 惰性載入 AuthModule ***
  // 所有認證相關的路由將會以 '/auth/' 為前綴
  {
    path: 'auth', // 所有 auth 相關路由都會在這個路徑下，例如 /auth/reset-password/:token
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 捕獲所有未定義路由並重定向到首頁（或者 404 頁面）
  // 確保這個在所有其他路由之後
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }