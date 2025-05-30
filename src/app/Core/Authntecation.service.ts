
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private apiUrl = 'YOUR_API_ENDPOINT'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any | FormData): Observable<any> {
    const endpoint = userData instanceof FormData
      ? `${this.apiUrl}/register/teacher`
      : `${this.apiUrl}/register/student`;

    return this.http.post(endpoint, userData);
  }
}
