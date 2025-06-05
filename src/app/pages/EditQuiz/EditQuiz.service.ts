import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


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
  isCorrect: boolean
}
@Injectable({
  providedIn: 'root'
})
export class EditQuizService {
  quiz: IQuiz = {
    name: '',
    duration: '',
    grade: 0,
    questions: [],
  }



  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }



  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'token': token,
      'Content-Type': 'application/json'
    });
  }



  getExam(id: string): Observable<any> {

    const headers = this.getHeaders()
    return this.http.get(
      `https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/exam/${id}`,
      { headers }
    );
  }
  editQuiz(q: IQuiz, id: string): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put(
      `https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/exam/${id}/edit`,
      q,
      { headers }
    )
  }
}
