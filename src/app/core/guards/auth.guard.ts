import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.getToken()) {
      alert('請先登入'); // 提示訊息
      this.router.navigate(['/auth/login']); // 重定向到登入頁面
      return false;
    }

    return this.authService.validateToken().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          this.authService.logout();
          alert('請先登入'); // 提示訊息
          this.router.navigate(['/auth/login']); // 重定向到登入頁面
          return false;
        }
      }),
      catchError(() => {
        this.authService.logout();
        alert('請先登入'); // 提示訊息
        this.router.navigate(['/auth/login']); // 重定向到登入頁面
        return of(false);
      })
    );
  }
}