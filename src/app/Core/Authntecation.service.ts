
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService  {
//   private apiUrl = 'https://exam-management-sys-beta.vercel.app/api/v1/auth';
//   constructor(private http: HttpClient) { }

//   login(credentials: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, credentials);
//   }

//   register(userData: any | FormData): Observable<any> {
//     const endpoint = userData instanceof FormData
//       ? `${this.apiUrl}/register/teacher`
//       : `${this.apiUrl}/register/student`;

//     return this.http.post(endpoint, userData);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://exam-management-sys-beta.vercel.app/api/v1/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // تخزين التوكن بعد تسجيل الدخول
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // الحصول على التوكن
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // حذف التوكن عند تسجيل الخروج
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // إنشاء headers مع التوكن
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  // في Authntecation.service.ts
isLoggedIn(): boolean {
  return !!this.getToken();
}

getUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  // decode token to get role (example using jwt-decode)
  const decoded: any = jwt_decode(token);
  return decoded.role;
}
}

function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

