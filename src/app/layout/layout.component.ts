import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSearchClick(): void {
    // 這裡將會是搜尋功能的邏輯入口
    console.log('搜尋圖示被點擊了！');
    // 稍後我們會在這裡顯示搜尋條列
  }

  onAuthClick(): void {
    // 這裡將會是登入註冊功能的邏輯入口
    console.log('登入註冊圖示被點擊了！');
    // 稍後我們會在這裡顯示登入註冊頁籤
  }
}