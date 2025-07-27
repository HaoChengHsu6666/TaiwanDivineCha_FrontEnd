import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/auth/profile'; // 後端個人資料 API 端點

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(this.apiUrl, user);
  }
}
