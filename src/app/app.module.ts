import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // 確保這個也導入了，用於 ProductService
import { AuthInterceptor } from './core/services/auth.interceptor'; // 導入我們的 Interceptor
import { CommonModule } from '@angular/common'; // 導入 CommonModule
import { RouterModule } from '@angular/router'; // 導入 RouterModule
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module'; // 導入 ShoppingCartModule

// Angular Material 模組
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field'; // 新增
import { MatInputModule } from '@angular/material/input'; // 新增
import { MatTabsModule } from '@angular/material/tabs'; // 新增
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';


// 元件
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
// import { ContactComponent } from './contact/contact.component';
// import { AboutComponent } from './about/about.component';
import { ProductService } from './core/services/product.service'; // 導入 ProductService
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { ProductOptionsComponent } from './product-options/product-options.component';
import { BrandStoryComponent } from './brand-story/brand-story.component';
import { FAQComponent } from './faq/faq.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout/checkout.component';
import { StoreSelectionModalComponent } from './store-selection-modal.component'; // <-- 導入 FormsModule
import { PersonalCenterComponent } from './personal-center/personal-center.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    // ContactComponent,
    // AboutComponent,
    ProductDetailComponent,
    ProductListComponent,
    ProductOptionsComponent,
    BrandStoryComponent,
    FAQComponent,
    CheckoutComponent,
    StoreSelectionModalComponent,
    PersonalCenterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule, // 添加 CommonModule
    RouterModule, // 添加 RouterModule
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule, // 添加 MatCardModule
    MatDialogModule, // **重要：為了使用 MatDialog 服務**
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    // AuthModule, // ** 配合惰性載入(Lazy Loading) 故不使用 AuthModule** 
    ShoppingCartModule,
    ReactiveFormsModule,
    MatListModule
  ],
  providers: [
    provideAnimationsAsync(),
    ProductService, // 提供 ProductService
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // 註冊我們的 Interceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }