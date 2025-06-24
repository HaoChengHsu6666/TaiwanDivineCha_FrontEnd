// src/app/layout/layout.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // 導入 MatDialog
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component'; // 導入 AuthModalComponent
import { AuthService } from '../core/services/auth.service'; // 導入 AuthService (用於檢查登入狀態)


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isSearchOverlayActive: boolean = false;
  searchTerm: string = '';
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  private searchInputSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog, // 注入 MatDialog
    public authService: AuthService // 注入 AuthService，方便在模板中使用 isLoggedIn
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });

    this.searchInputSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.performSearch(term))
    ).subscribe(results => {
      this.filteredProducts = results;
    });
  }

  toggleSearchOverlay(): void {
    this.isSearchOverlayActive = !this.isSearchOverlayActive;
    if (!this.isSearchOverlayActive) {
      this.searchTerm = '';
      this.filteredProducts = [];
      this.searchInputSubject.next('');
    }
  }

  onSearchInput(): void {
    this.searchInputSubject.next(this.searchTerm);
  }

  performSearch(term: string): Observable<Product[]> {
    if (!term || term.trim() === '') {
      return of([]);
    }

    if (this.allProducts.length === 0) {
      return of([]);
    }

    const lowerCaseTerm = term.toLowerCase();
    const results = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerCaseTerm) ||
      product.category.toLowerCase().includes(lowerCaseTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerCaseTerm))
    );
    return of(results);
  }

  executeSearch(): void {
    // 點擊搜尋按鈕時，如果搜尋詞不為空，導航到產品列表頁並帶上查詢參數
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchTerm } });
      this.toggleSearchOverlay(); // 關閉搜尋浮層
    }
  }

  // 打開認證模態框
  openAuthModal(tabIndex: number = 0): void {
    this.dialog.open(AuthModalComponent, {
      width: '450px', // 模態框寬度
      data: { selectedTabIndex: tabIndex } // 傳遞數據以預設打開登入(0)或註冊(1)頁籤
    });
  }

  // 登出方法
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // 登出後導航到首頁
  }
}