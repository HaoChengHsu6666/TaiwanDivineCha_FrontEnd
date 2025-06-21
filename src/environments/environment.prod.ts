// src/environments/environment.prod.ts

export const environment = {
  production: true, // 表示這是生產環境
  // 這裡的 apiUrl 需要替換成您實際部署到生產環境後的後端 API 地址
  // 假設生產環境後端是 https://api.yourdomain.com
  apiUrl: 'https://api.yourdomain.com/api'
  // 或者如果後端和前端部署在同一個域名下，只是路徑不同，可能是 '/api'
  // apiUrl: '/api'
};