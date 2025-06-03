
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://exam-management-sys-beta.vercel.app/api/v1/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }
// في Authntecation.service.ts
login(credentials: { email: string; password: string }): Observable<{token: string}> {
  return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      console.log('Full API response:', response); // أضف هذا السطر
      if (!response.token && !response.access_token && !response.data) {
        throw new Error('No token found in response');
      }

      const token = response.token || response.access_token || response.data;
      this.setToken(token);
    }),
    map(response => ({
      token: response.token || response.access_token || response.data
    }))
  );
}

  register(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return !!decoded && !this.isTokenExpired(decoded);
    } catch {
      return false;
    }
  }

  private isTokenExpired(decodedToken: any): boolean {
    return decodedToken.exp * 1000 < Date.now();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    } catch {
      return null;
    }
  }
}
