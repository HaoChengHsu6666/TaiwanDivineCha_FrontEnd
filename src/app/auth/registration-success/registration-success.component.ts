// src/app/auth/registration-success/registration-success.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent implements OnInit {
  isAccountActivated: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // 檢查查詢參數，判斷是否是從帳戶激活後跳轉過來
    this.route.queryParams.subscribe(params => {
      this.isAccountActivated = params['activated'] === 'true';
    });
  }

  goToLogin(): void {
    // 導航到首頁，並提示用戶可以打開登入模態框
    this.router.navigate(['/']);
    // 如果您希望直接打開登入模態框，則需要從 LayoutComponent 觸發
    // 這通常需要在一個更高層的服務中管理對話框的開啟
  }
}