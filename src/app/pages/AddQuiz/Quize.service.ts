import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
export class QuizService {
  quiz: IQuiz = {
    name: '',
    grade: 100,
    duration: '',
    questions: [
      {
        theQuestion: '',
        options: [
          { key: 'A', option: '', isCorrect: false },
          { key: 'B', option: '', isCorrect: false },
        ],
      },
    ],
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
  submitQuiz(q: IQuiz): Observable<any> {
    const headers = new HttpHeaders({
      token: this.getToken(),
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/exam`, q, { headers });
  }
}
