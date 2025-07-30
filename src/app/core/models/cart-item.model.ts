export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  category: string;
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
  weight: number;
}