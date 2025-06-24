export interface User {
  userId?: number;
  email: string;
  password?: string; // 註冊時可能不需要，登入響應中也不應該包含
  role?: string; // 例如 'USER', 'ADMIN'
  isVerified?: boolean; // 帳戶是否已驗證
  createdDate?: Date;
  lastModifiedDate?: Date;
  // 您可能還需要其他用戶相關的屬性
}