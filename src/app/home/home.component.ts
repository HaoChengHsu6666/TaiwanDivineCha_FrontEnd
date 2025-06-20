import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // 輪播圖圖片路徑陣列 (請確保圖片存在於 src/assets/images/)
  // 假設您的圖片是 tea1.jpg, tea2.jpg, tea3.jpg
  images: string[] = [
    'assets/images/tea_1.jpg',
    'assets/images/tea_2.jpg',
    'assets/images/tea_3.jpg',
    'assets/images/tea_4.jpg',
    'assets/images/tea_5.jpg'
  ];

  currentImageIndex: number = 0;
  currentBackground: string = ''; // 當前顯示的背景圖片路徑
  currentAnimationClass: string = 'fade-in'; // <--- 初始化為 fade-in // 要淡入淡出效果打開

  private autoSlideSubscription: Subscription | undefined; // 要淡入淡出效果打開
  private slideIntervalTime: number = 2000; // 2秒 // 要淡入淡出效果打開

  constructor() { }

  ngOnInit(): void {
    this.currentBackground = this.images[this.currentImageIndex]; // 初始化第一張圖片
    this.startAutoSlide(); // 啟動自動播放
  }

  startAutoSlide(): void {
    this.stopAutoSlide(); // 確保每次啟動前都清除舊的定時器
    this.autoSlideSubscription = interval(this.slideIntervalTime + 1000).subscribe(() => { // 間隔時間略長於動畫時間
      this.nextSlide();
    });
  }

  stopAutoSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
      this.autoSlideSubscription = undefined;
    }
  }

  // 要縮放效果打開
  // nextSlide(): void {
  //   this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  //   this.currentBackground = this.images[this.currentImageIndex];
  //   // CSS 會自動處理動畫
  // }

  // 要淡入淡出效果打開
  nextSlide(): void {
    // 先移除 class，讓動畫重置
    this.currentAnimationClass = '';
    setTimeout(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.currentBackground = this.images[this.currentImageIndex];
      this.currentAnimationClass = 'fade-in'; // <--- 重新添加 fade-in class 觸發動畫
    }, 50); // 短暫延遲，確保 class 移除和添加之間有足夠時間觸發動畫
  }

}