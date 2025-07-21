// src/app/shared/models/product.model.ts (或 core/models/product.model.ts)
export interface Product {
  id: string; // 商品唯一識別碼，例如 'sanxia-biluochun'
  name: string; // 商品名稱，例如 '三峽碧螺春綠'
  category: string; // 茶品分類(來品神茶)，例如 '綠茶', '烏龍茶'
  imageUrl: string; // 商品主要圖片路徑
  detailImages: string[]; // 商品細節圖片路徑陣列
  description: string; // 詳細描述
  price: number; // 價格
  weight?: string; // 重量 (可選)
  features?: string[]; // 特點 (可選)
  origin?: string; // 產地 (可選)
  stock: number; // 庫存
}