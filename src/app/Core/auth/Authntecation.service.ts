import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    'https://examsestembackend-production.up.railway.app/api/v1/auth';
  private tokenKey = 'token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userInfoSubject = new BehaviorSubject<{
    name: string;
    userProfile: any;
  } | null>(null);

  userInfo$ = this.userInfoSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    // ✅ تأكد أننا داخل المتصفح وليس SSR
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      const profileStr = localStorage.getItem('userProfile');

      if (name) {
        try {
          const profile = profileStr ? JSON.parse(profileStr) : null;
          this.userInfoSubject.next({
            name,
            userProfile: profile,
          });
        } catch {
          this.userInfoSubject.next({
            name,
            userProfile: null,
          });
        }
      }
    }
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; name: string; userProfile: any }> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login response:', response);

        const token = response?.data?.token;
        const user = response?.data?.user;

        if (!token || typeof token !== 'string') {
          throw new Error('No token found in response');
        }

        this.setToken(token);
        this.isLoggedInSubject.next(true);

        // ✅ تحديث بيانات المستخدم في BehaviorSubject
        this.userInfoSubject.next({
          name: user?.name || '',
          userProfile: user?.userProfile || null,
        });

        // ✅ تخزين في localStorage لو حبيت تستخدمه كـ fallback
        localStorage.setItem('userName', user?.name || '');
        localStorage.setItem(
          'userProfile',
          JSON.stringify(user?.userProfile || null)
        );
      }),
      map((response) => {
        return {
          token: response?.data?.token,
          name: response?.data?.user?.name,
          userProfile: response?.data?.user?.userProfile,
        };
      }),
      catchError((error) => {
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
      catchError((error) => {
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

  getToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR check
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userName'); // ← إزالة الاسم
    localStorage.removeItem('userProfile'); // ← إزالة الصورة

    this.isLoggedInSubject.next(false);
    this.userInfoSubject.next(null); // ← تصفير بيانات المستخدم
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
