import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service'; // 確保路徑正確
import { Product } from '../core/models/product.model'; // 確保 Product 模型的路徑正確
import { Observable, of, Subject } from 'rxjs'; // 導入 of 運算符和 Subject
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'; // 導入這些運算符
import { Router } from '@angular/router'; // 如果要導航到商品詳情頁，可能需要 Router

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
    private router: Router // 注入 Router
  ) { }

  ngOnInit(): void {
    // 首先，確保產品資料被載入
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      // console.log('所有產品已載入:', this.allProducts.length); // 輔助調試
    });

    // 將搜尋輸入和 allProducts 結合，確保在執行搜尋邏輯時 allProducts 已存在
    // 使用 combineLatest 確保當 searchInputSubject 發出值且 allProducts 存在時才執行
    // 或者更直接地，在 performSearch 內部確保 allProducts 已載入

    // 監聽搜尋輸入，並應用 debounceTime 和 distinctUntilChanged
    this.searchInputSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.performSearch(term))
    ).subscribe(results => {
      this.filteredProducts = results;
    });
  }

  // 切換搜尋彈窗的顯示與隱藏
  toggleSearchOverlay(): void {
    this.isSearchOverlayActive = !this.isSearchOverlayActive;
    if (!this.isSearchOverlayActive) {
      // 關閉時清空搜尋欄和結果
      this.searchTerm = '';
      this.filteredProducts = [];
    }
  }

  // 當搜尋輸入框有任何輸入時觸發
  onSearchInput(): void {
    this.searchInputSubject.next(this.searchTerm);
  }

  // 執行搜尋的實際邏輯
  performSearch(term: string): Observable<Product[]> {
    if (!term || term.trim() === '') {
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

  // 點擊搜尋按鈕時觸發
  executeSearch(): void {
    this.onSearchInput(); // 觸發即時搜尋
    // 點擊搜尋按鈕後導航到一個專門的搜尋結果頁
    if (this.searchTerm.trim() !== '') {
      // 導航到產品列表頁，並將搜尋詞作為查詢參數 'q' 傳遞
      this.router.navigate(['/product-list'], { queryParams: { q: this.searchTerm } });
      this.toggleSearchOverlay(); // 導航後關閉搜尋彈窗
    } else {
      // 如果搜尋詞為空，可以給予提示或不做任何操作
      console.log('請輸入搜尋關鍵字。');
    }
    
  }
}