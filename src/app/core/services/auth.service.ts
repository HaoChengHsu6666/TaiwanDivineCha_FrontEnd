import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // 導入 tap
import { environment } from '../../../environments/environment';

// 定義登入回應的介面，使其與後端 AuthenticationResponse 匹配
interface AuthResponse {
  token: string; // 後端回傳的 JWT Token
  isProfileCompleted?: boolean; // 新增：表示用戶資料是否已完成
}

// 定義註冊成功的介面，後端可能只返回一個訊息
interface RegisterResponse {
  message: string;
}

// 定義驗證 Email 的回應
interface VerifyEmailResponse {
  message: string;
  // 根據您的後端設計，這裡可能不需要 jwt 或 user，
  // 因為驗證後是引導用戶去「設定密碼」，而非直接登入。
  // 如果後端verify-email後直接登入，則需要jwt和user
  // jwt?: string;
  // user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  /**
   * 註冊新用戶並發送驗證郵件 (Email Only!)
   * @param email 用戶的電子郵件
   */
  register(email: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email }).pipe(
    catchError((error: any): Observable<never> => {
          return this.handleError(error);
        })    
    );
  }

  /**
   * 檢查電子郵件是否已註冊
   * @param email 用戶的電子郵件
   * @returns Observable<boolean> true if email exists, false otherwise
   * 後端 API 應返回 { exists: true/false } 或直接 200/409 (Conflict)
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email?email=${email}`).pipe(
      map(response => response.exists),
      catchError(error => {
        // 如果後端在Email存在時返回 409 Conflict，也可以這樣處理
        if (error.status === 409) {
          return of(true); // 視為Email已存在
        }
        console.error('Error checking email existence:', error);
        return of(false); // 其他錯誤或不存在
      })
    );
  }

  /**
   * 獲取驗證碼圖片 URL
   * 假設後端 /api/auth/captcha 返回一個圖片 URL (data:image/png;base64,...)
   */
  getCaptchaImageUrl(): Observable<string> {
    return this.http.get(`${this.apiUrl}/captcha`, { responseType: 'text' }).pipe( // 假設後端直接返回 base64 字串或 URL
      map(response => {
        // 如果後端返回的是 base64 編碼的圖片字串，您需要確保它是 'data:image/png;base64,' 開頭
        // 否則，如果後端直接返回圖片 URL，則直接返回 response
        // 這裡假設後端返回的就是可以直接用於 img src 的字符串
        return response;
      }),
      catchError(this.handleError)
    );
  }


  /**
   * 驗證帳戶激活Token
   * @param token 激活Token
   * 後端 API 應返回 JWT Token 和用戶信息，以便前端自動登入
   */
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(`${this.apiUrl}/verify-email?token=${token}`).pipe(
    catchError(err => this.handleError(err))
    );
  }

  /**
   * 登入方法
   * @param email
   * @param password
   * @param captcha
   * 後端 API 應返回包含 JWT Token 的 AuthResponse
   */
  login(credentials: { email: string, password: string, captcha: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // 將 isProfileCompleted 儲存到 localStorage
          localStorage.setItem('isProfileCompleted', response.isProfileCompleted ? 'true' : 'false');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 發送重設密碼 Email
   * @param email 用戶的電子郵件
   */
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 重設密碼
   * @param token 重設密碼 Token
   * @param newPassword 新密碼
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

  // 輔助錯誤處理
  private handleError(error: any): Observable<never> {
    let errorMessage = '發生未知錯誤。';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `錯誤: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status) {
        errorMessage = `錯誤碼: ${error.status}`;
      }
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    console.error('API 請求失敗:', errorMessage, error);
    return throwError(() => new Error(errorMessage)); // 使用工廠函數返回錯誤
  }

  validateToken(): Observable<boolean> {
    return this.http.post<{ isValid: boolean }>(`${this.apiUrl}/validate-token`, {}).pipe(
      map(response => response.isValid),
      catchError(() => of(false))
    );
  }

  // 取得 JWT Token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 檢查用戶是否登入
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 獲取 isProfileCompleted 狀態
  getIsProfileCompleted(): boolean {
    const isCompleted = localStorage.getItem('isProfileCompleted');
    return isCompleted === 'true';
  }

  // 登出
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // 保留移除 currentUser，以防舊資料殘留
    // 您可能還需要導航到登入頁面或主頁
  }
}