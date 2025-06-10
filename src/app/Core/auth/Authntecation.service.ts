import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://examsestembackend-production.up.railway.app/api/v1/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

login(credentials: { email: string; password: string }): Observable<{token: string}> {
  return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      const token = response?.token || response?.access_token || response?.data?.token || response?.data;

      if (!token || typeof token !== 'string') {
        throw new Error('No token found in response');
      }

      this.setToken(token);
    }),
    map(response => ({
      token: response?.token || response?.access_token || response?.data?.token || response?.data
    })),
    catchError(error => {
      let errorMessage = 'Login failed';

      if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    })
  );
}

register(userData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userData).pipe(
    catchError(error => {
      let errorMessage = 'Registration failed';

      if (error.status === 400 && error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Format validation errors from backend
        errorMessage = Object.values(error.error.errors).join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
