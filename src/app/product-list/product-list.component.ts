import { Component, OnInit } from '@angular/core';
import { ProductService } from '../core/services/product.service'; // 確認路徑正確
import { Product } from '../core/models/product.model'; // 確認路徑正確
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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
        if (category) {
          return this.productService.getProductsByCategory(category);
        } else {
          return this.productService.getProducts(); // 如果沒有分類參數，顯示所有商品
        }
      })
    );
  }
}