// src/app/auth/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // 用於模擬網絡延遲

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // 模擬登入請求
  login(email: string, password: string): Observable<any> {
    // **注意：這裡僅為模擬，實際應用中應調用後端 API**
    console.log(`模擬登入嘗試 - Email: ${email}, 密碼: ${password}`);

    // 模擬成功的登入
    if (email === 'test@example.com' && password === 'Password123') {
      return of({
        success: true,
        message: '登入成功！',
        token: 'mock-jwt-token-123',
        user: { email: email }
      }).pipe(delay(1000)); // 模擬網絡延遲 1 秒
    } else {
      // 模擬失敗的登入
      return throwError(() => new Error('Email 或密碼不正確。')).pipe(delay(1000));
    }
  }

  // 未來您可能還會添加其他方法，例如：
  // register(userData: any): Observable<any> { ... }
  // sendResetPasswordEmail(email: string): Observable<any> { ... }
  // resetPassword(newPassword: string, token: string): Observable<any> { ... }
  // checkEmailExists(email: string): Observable<boolean> { ... }
}