import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service'; // 確保路徑正確
import { Product } from '../core/models/product.model'; // 確保 Product 模型的路徑正確
import { Observable, of, Subject } from 'rxjs'; // 導入 of 運算符和 Subject
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'; // 導入這些運算符
import { Router } from '@angular/router'; // 如果要導航到商品詳情頁，可能需要 Router
import { MatDialog } from '@angular/material/dialog'; // **導入 MatDialog**
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component'; // **導入 AuthModalComponent**

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
    private router: Router, // 注入 Router
    private dialog: MatDialog // **注入 MatDialog 服務**
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
      // 防抖動。 
      // 在這個操作符之後，只有當 searchInputSubject 
      // 在 300 毫秒內沒有發出新的值時，才會將最後一個值傳遞給下一個操作符。
      // 這可以有效減少用戶快速輸入時頻繁觸發搜尋的次數，提升性能。
      distinctUntilChanged(),
      // 去重複。 
      // 只有當發出的值與前一個值不同時，才會將值傳遞給下一個操作符。
      // 這可以避免對相同的搜尋詞重複執行搜尋操作。
      switchMap(term => this.performSearch(term))
      // 新質取代就值。 
      // 如果 searchInputSubject 發出新值，它會取消之前仍在進行中的 performSearch 訂閱（如果有的話），
      // 並切換到訂閱新的 performSearch 返回的 Observable。
      // 這對於處理用戶快速輸入時的「過時請求」非常有用，確保你總是只處理最新一次搜尋請求的結果。
    ).subscribe(results => {
      this.filteredProducts = results;
    });
  }

  // 切換搜尋彈窗的顯示與隱藏
  toggleSearchOverlay(): void {
    this.isSearchOverlayActive = !this.isSearchOverlayActive;
    if (!this.isSearchOverlayActive) {
      this.searchTerm = '';
      this.filteredProducts = [];
      // 當關閉搜尋框時，也可以清空 searchInputSubject 的緩衝
      // 避免下次打開時，因為上一次未完成的 debounce 而立即觸發搜尋
      this.searchInputSubject.next('');
    }
  }

  // 當搜尋輸入框有任何輸入時觸發
  onSearchInput(): void {
    // console.log(this.searchTerm);
    this.searchInputSubject.next(this.searchTerm);
  }

  // 執行搜尋的實際邏輯
  performSearch(term: string): Observable<Product[]> {
    if (!term || term.trim() === '') {
      return of([]);
    }

    // 再次確認 allProducts 是否已載入
    if (this.allProducts.length === 0) {
      // console.warn('在 performSearch 中：產品資料尚未載入，返回空結果。');
      return of([]); // 如果資料未載入，立即返回空結果
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
      this.router.navigate(['/products'], { queryParams: { q: this.searchTerm } });
      this.toggleSearchOverlay(); // 導航後關閉搜尋彈窗
    } else {
      // 如果搜尋詞為空，可以給予提示或不做任何操作
      alert('請輸入搜尋關鍵字。');
    }
    
  }

  // **新增打開認證模態框的方法**
  openAuthModal(): void {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      width: '500px', // 設定模態框寬度，您可以根據設計調整
      // height: 'auto', // 高度通常根據內容自動調整
      // disableClose: true, // 點擊背景或按 ESC 鍵是否關閉，預設為 false (可關閉)
      panelClass: 'auth-modal-panel' // 添加自定義 class 以便進一步樣式化
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The authentication dialog was closed');
      // 您可以在這裡處理模態框關閉後的回調，例如刷新用戶狀態等
    });
  }
}