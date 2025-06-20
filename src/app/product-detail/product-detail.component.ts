import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../core/services/product.service'; // 確認路徑正確
import { Product } from '../core/models/product.model'; // 確認路徑正確
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common'; // **引入 Location 服務**

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<Product | undefined> = EMPTY;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location // **注入 Location 服務**
  ) { }

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        if (productId) {
          return this.productService.getProductById(productId);
        }
        return EMPTY; // 如果沒有 id 則返回空
      })
    );
  }

  // **新增關閉方法**
  closeProductDetail(): void {
    this.location.back(); // 使用 Location 服務導航回上一頁
  }
}