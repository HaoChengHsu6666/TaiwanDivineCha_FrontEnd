import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; // 確保這個也導入了，用於 ProductService

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


// 元件
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
// import { ContactComponent } from './contact/contact.component';
// import { AboutComponent } from './about/about.component';
import { ProductService } from './core/services/product.service'; // 導入 ProductService
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms'; // <-- 導入 FormsModule


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    // ContactComponent,
    // AboutComponent,
    ProductDetailComponent,
    ProductListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    // AuthModule, // ** 配合惰性載入(Lazy Loading) 故不使用 AuthModule** 
  ],
  providers: [
    provideAnimationsAsync(),
    ProductService // 提供 ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }