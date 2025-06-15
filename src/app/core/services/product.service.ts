// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 'sanxia-biluochun',
      name: '三峽碧螺春綠',
      category: '綠茶',
      imageUrl: 'assets/products/sanxia-biluochun.jpg',
      detailImages: [
        // 'assets/products/sanxia-biluochun-detail.jpg'
      ],
      description: '這是一款來自三峽的頂級碧螺春綠茶，茶葉鮮嫩，香氣清雅，口感甘醇。',
      price: 800,
      weight: '150g',
      features: ['手工採摘', '清香甘醇', '高山綠茶'],
      origin: '台灣三峽'
    },
    {
      id: 'shanlinxi-qing',
      name: '杉林溪青',
      category: '烏龍茶',
      imageUrl: 'assets/products/shanlinxi-qing.jpg',
      detailImages: [
        // 'assets/products/shanlinxi-qing-detail.jpg'
      ],
      description: '杉林溪高山烏龍茶，茶湯金黃明亮，帶有獨特的花果香，喉韻悠長。',
      price: 1200,
      weight: '150g',
      features: ['高山烏龍', '花果香', '喉韻悠長'],
      origin: '台灣杉林溪'
    },
    {
      id: 'dongding-oolong',
      name: '凍頂烏龍',
      category: '烏龍茶',
      imageUrl: 'assets/products/dongding-oolong.jpg',
      detailImages: [
        // 'assets/products/dongding-oolong-detail.jpg'
      ],
      description: '經典凍頂烏龍，茶葉緊實，發酵程度適中，香氣濃郁，口感醇厚回甘。',
      price: 950,
      weight: '150g',
      features: ['傳統工藝', '濃郁醇厚', '回甘'],
      origin: '台灣鹿谷'
    },
    {
      id: 'beipu-oriental-beauty',
      name: '北埔東方美人',
      category: '東方美人茶',
      imageUrl: 'assets/products/beipu-oriental-beauty.jpg',
      detailImages: [
        // 'assets/products/beipu-oriental-beauty-detail.jpg'
      ],
      description: '獨具蜜香和熟果香的東方美人茶，茶湯橙紅，滋味醇厚甘潤。',
      price: 1500,
      weight: '75g',
      features: ['小綠葉蟬', '蜜香', '熟果香'],
      origin: '台灣北埔'
    },
    {
      id: 'sun-moon-lake-ruby',
      name: '日月潭紅玉',
      category: '紅茶',
      imageUrl: 'assets/products/sun-moon-lake-ruby.jpg',
      detailImages: [
        // 'assets/products/sun-moon-lake-ruby-detail.jpg'
      ],
      description: '台灣特有紅茶品種，帶有天然肉桂和薄荷香氣，茶湯紅艷，口感溫潤。',
      price: 700,
      weight: '100g',
      features: ['台茶18號', '肉桂薄荷香', '溫潤'],
      origin: '台灣日月潭'
    },
    {
        id: 'Mucha_Tieguanyin',
        name: '木柵鐵觀音',
        category: '鐵觀音',
        imageUrl: 'assets/products/Mucha_Tieguanyin.jpg', // 根據您提供的檔案名
        detailImages: [
          // 'assets/products/Mucha_Tieguanyin-detail1.jpg' // 請確認此圖片是否存在
        ],
        description: '傳統木柵鐵觀音，經過重發酵和足夠的烘焙，茶湯醇厚，帶有獨特的火香和觀音韻。',
        price: 1000,
        weight: '150g',
        features: ['傳統工藝', '濃郁焙火香', '觀音韻'],
        origin: '台灣木柵'
      },
      {
        id: 'Alishan_Jinxuan_Tea',
        name: '阿里山金萱',
        category: '烏龍茶',
        imageUrl: 'assets/products/Alishan_Jinxuan_Tea.jpg', // 根據您提供的檔案名
        detailImages: [
          // 'assets/products/Alishan_Jinxuan_Tea-detail1.jpg' // 請確認此圖片是否存在
        ],
        description: '來自阿里山高海拔的金萱茶，茶湯清澈，帶有獨特的奶香味和淡淡的花香，口感滑潤甘甜。',
        price: 900,
        weight: '150g',
        features: ['高山金萱', '天然奶香', '清甜滑潤'],
        origin: '台灣阿里山'
      },
      {
        id: 'Lishan_Green_Tea',
        name: '梨山烏龍綠',
        category: '綠茶', // 或者更準確地說，是介於綠茶和烏龍茶之間
        imageUrl: 'assets/products/Lishan_Green_Tea.jpg', // 根據您提供的檔案名
        detailImages: [
          // 'assets/products/Lishan_Green_Tea-detail1.jpg' // 請確認此圖片是否存在
        ],
        description: '梨山烏龍綠，結合了綠茶的鮮爽和烏龍茶的醇厚，口感清雅回甘，帶有高山獨有的冷礦味。',
        price: 1300,
        weight: '150g',
        features: ['高山茶', '清雅回甘', '冷礦味'],
        origin: '台灣梨山'
      }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.category === category);
    return of(filteredProducts);
  }
}