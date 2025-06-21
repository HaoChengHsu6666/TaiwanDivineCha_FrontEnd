// src/app/auth/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // 用於模擬網絡延遲
// import { HttpClient } from '@angular/common/http'; // 如果連接後端，需要這個

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 模擬已註冊的 Email 列表
  private registeredEmails = ['test@example.com', 'admin@example.com'];

  constructor() { }
  // constructor(private http: HttpClient) { } // 如果連接後端，解開註解

  // 模擬登入請求
  login(email: string, password: string): Observable<any> {
    // **注意：這裡僅為模擬，實際應用中應調用後端 API**
    console.log(`模擬登入嘗試 - Email: ${email}, 密碼: ${password}`);

    // 模擬成功的登入
    if (email === 'test@gmail.com' && password === 'Password123') {
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

  /**
   * 模擬發送重設密碼 Email
   * @param email 用戶的 Email 地址
   */
  sendResetPasswordEmail(email: string): Observable<any> {
    // **注意：這裡僅為模擬，實際應用中應調用後端 API**
    // return this.http.post('/api/auth/forgot-password', { email });

    console.log(`模擬發送重設密碼 Email 到: ${email}`);
    // 模擬成功發送，只有當 Email 存在時才成功
    if (this.registeredEmails.includes(email)) {
      // 實際應用中，後端會生成一個帶有 token 的重設密碼連結並發送
      return of({ success: true, message: '重設密碼連結已發送。' }).pipe(delay(1500));
    } else {
      // 模擬 Email 未註冊的錯誤
      return throwError(() => new Error('此 Email 尚未註冊，請檢查。')).pipe(delay(1500));
    }
  }

  /**
   * 模擬檢查 Email 是否已存在/已註冊
   * @param email 要檢查的 Email 地址
   * @returns Observable<boolean> 如果 Email 已註冊則為 true，否則為 false
   */
  checkEmailExists(email: string): Observable<boolean> {
    // **注意：這裡僅為模擬，實際應用中應調用後端 API**
    // return this.http.get<boolean>(`/api/auth/check-email-exists?email=${email}`);

    console.log(`模擬檢查 Email 是否存在: ${email}`);
    const exists = this.registeredEmails.includes(email);
    return of(exists).pipe(delay(300)); // 模擬網絡延遲
  }

  // 未來您可能還會添加其他方法，例如：
  // register(userData: any): Observable<any> { ... }
  // sendResetPasswordEmail(email: string): Observable<any> { ... }
  // resetPassword(newPassword: string, token: string): Observable<any> { ... }
  // checkEmailExists(email: string): Observable<boolean> { ... }
  // activateAccount(token: string): Observable<any> { ... }

}