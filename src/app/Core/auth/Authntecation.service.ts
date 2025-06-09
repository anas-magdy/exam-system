import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    'https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/auth';
  private tokenKey = 'token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Full API response:', response);

        const token =
          response?.token ||
          response?.access_token ||
          response?.data?.token ||
          response?.data;

        if (!token || typeof token !== 'string') {
          throw new Error('No token found in response');
        }

        this.setToken(token);
      }),
      map((response) => ({
        token:
          response?.token ||
          response?.access_token ||
          response?.data?.token ||
          response?.data,
      })),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(userData: FormData): Observable<any> {
    console.log('Registering user with data:');
    userData.forEach((value, key) => console.log(key, value));
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => console.log('Registration response:', response)),
      catchError((error) => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.tokenKey, token);
      this.loggedIn.next(true);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.tokenKey);
      this.loggedIn.next(false);
    }
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

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return !!decoded && !this.isTokenExpired(decoded);
    } catch {
      return false;
    }
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
