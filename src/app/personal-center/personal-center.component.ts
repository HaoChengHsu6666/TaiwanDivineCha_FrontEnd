import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar'; // For showing messages

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.scss']
})
export class PersonalCenterComponent implements OnInit {

  userProfile: User = { email: '' }; // Initialize with an empty email

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data: User) => {
        this.userProfile = data;
        // Format birth date for input type="date"
        if (this.userProfile.birth) {
          this.userProfile.birth = this.formatDateForInput(this.userProfile.birth);
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.snackBar.open('無法載入個人資料，請稍後再試。', '關閉', { duration: 3000 });
      }
    });
  }

  saveProfile(): void {
    console.log('userProfile.name before sending:', this.userProfile.name);
    // Ensure birth date is in YYYY-MM-DD format before sending to backend
    const profileToSave = { ...this.userProfile };
    if (profileToSave.birth) {
      profileToSave.birth = this.formatDateForBackend(profileToSave.birth);
    }

    this.userService.updateUserProfile(profileToSave).subscribe({
      next: (data: User) => {
        this.userProfile = data;
        // Re-format birth date for display after successful save
        if (this.userProfile.birth) {
          this.userProfile.birth = this.formatDateForInput(this.userProfile.birth);
        }
        this.snackBar.open('個人資料已成功更新！', '關閉', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
        this.snackBar.open('更新個人資料失敗，請檢查輸入。', '關閉', { duration: 3000 });
      }
    });
  }

  // Helper to format date string for input type="date" (YYYY-MM-DD)
  private formatDateForInput(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to format date string for backend (YYYY-MM-DD or null)
  private formatDateForBackend(dateString: string | Date): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Invalid date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
