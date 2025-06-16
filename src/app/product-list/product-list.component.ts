import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service'; // 確認路徑正確
import { Product } from '../core/models/product.model'; // 確認路徑正確
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; // 確保導入 of

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products$: Observable<Product[]> = new Observable<Product[]>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute // 用於獲取查詢參數或路由參數
  ) { }

  ngOnInit(): void {
    this.products$ = this.route.queryParamMap.pipe( // 監聽查詢參數 (例如 ?category=綠茶)
      switchMap(params => {
        const category = params.get('category');
        const searchTerm = params.get('q');     // **獲取搜尋關鍵字 'q' 參數**

        if (category) {
          // 如果有 category 參數，則按分類篩選
          return this.productService.getProductsByCategory(category);
        } else if (searchTerm) {
          // **如果有搜尋關鍵字 'q' 參數，則進行搜尋過濾**
          const lowerCaseTerm = searchTerm.toLowerCase();
          return this.productService.getProducts().pipe(
            switchMap(allProducts => {
              const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(lowerCaseTerm) ||
                product.category.toLowerCase().includes(lowerCaseTerm) ||
                (product.description && product.description.toLowerCase().includes(lowerCaseTerm))
              );
              return of(filtered); // 返回過濾後的產品
            })
          );
        } else {
          // 如果沒有任何參數，顯示所有商品
          return this.productService.getProducts();
        }
      })
    );
  }
}