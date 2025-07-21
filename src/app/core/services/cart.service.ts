import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart'; // 後端 API 基礎 URL

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(productId: string, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items`, { productId, quantity });
  }

  updateCartItem(productId: string, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/items`, { productId, quantity });
  }

  removeCartItem(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${productId}`);
  }
}
