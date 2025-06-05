import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<{token: string}> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
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
      map(response => ({
        token:
          response?.token ||
          response?.access_token ||
          response?.data?.token ||
          response?.data
      })),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(userData: FormData): Observable<any> {
    console.log('Registering user with data:');
    // Log FormData contents for debugging
    userData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, value.name, value.size, value.type);
      } else {
        console.log(key, value);
      }
    });

    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => console.log('Registration response:', response)),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
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
