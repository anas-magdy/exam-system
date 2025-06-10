import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environments';

export interface IQuiz {
  name: string;
  duration: string;
  grade: Number;
  questions: IQuestion[];
}
export interface IQuestion {
  theQuestion: string;
  options: IChoice[];
}
export interface IChoice {
  key: string;
  option: string;
  isCorrect: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class EditQuizService {
  quiz: IQuiz = {
    name: '',
    duration: '',
    grade: 0,
    questions: [],
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  private apiUrl = environment.apiBaseUrl;
  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      token: token,
      'Content-Type': 'application/json',
    });
  }

  getExam(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/exam/${id}`, { headers });
  }
  editQuiz(q: IQuiz, id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/exam/${id}/edit`, q, { headers });
  }
}
