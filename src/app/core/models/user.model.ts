export interface User {
  userId?: number;
  email: string;
  password?: string; // 註冊時可能不需要，登入響應中也不應該包含
  role?: string; // 例如 'USER', 'ADMIN'
  isVerified?: boolean; // 帳戶是否已驗證
  createdDate?: Date;
  lastModifiedDate?: Date;
  name?: string;
  mobile?: string;
  birth?: string | null; // 使用 string | null 類型，因為後端是 LocalDate，前端通常會處理為 string，且可能為 null
  isProfileCompleted?: boolean;
  // 您可能還需要其他用戶相關的屬性
}