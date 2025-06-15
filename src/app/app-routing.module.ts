import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // 導入 HomeComponent

const routes: Routes = [
  {
    path: '', // 根路徑
    component: HomeComponent // 對應到 HomeComponent
  },
  // { path: 'about', component: AboutUsComponent }, // 稍後會建立
  // { path: 'products', component: ProductSectionComponent }, // 稍後會建立
  // { path: 'news', component: NewsComponent }, // 稍後會建立
  // { path: 'cart', component: CartComponent }, // 稍後會建立
  // { path: '**', redirectTo: '' } // 處理未匹配的路徑，導向首頁
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }