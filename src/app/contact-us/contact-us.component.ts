import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ContactUs {
  inquiryItem: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  estimatedQuantity?: number;
  budgetPerUnit?: string;
  deliveryDate?: Date;
  remarks?: string;
}

// 定義 ApiResponse 介面，與後端保持一致
export interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {

  contact: ContactUs = {
    inquiryItem: '',
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    email: ''
  };

  constructor(private http: HttpClient) { }

  submitForm() {
    // 移除 responseType: 'text'，讓 HttpClient 預設解析 JSON
    this.http.post<ApiResponse>('/api/contactUs', this.contact).subscribe(
      response => {
        // 從 response 物件中取得 message
        if (response.success) {
          alert(response.message);
          this.contact = {
            inquiryItem: '',
            companyName: '',
            contactPerson: '',
            contactPhone: '',
            email: ''
          };
        } else {
          alert('提交失敗：' + response.message);
        }
      },
      error => {
        // 錯誤處理可以更詳細，例如根據 error.status 判斷
        alert('提交失敗，請稍後再試');
        console.error('提交表單時發生錯誤:', error);
      }
    );
  }
}
