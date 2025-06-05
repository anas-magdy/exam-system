import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
export class QuizService {
  quiz: IQuiz = {
    name: "",
    grade:100,
    duration:"",
    questions: [
      {
        theQuestion: "",
        options: [
          { key: "A", option: "", isCorrect: false },
          { key: "B", option: "", isCorrect: false },
        ],
      },
    ],

  };

  constructor(private http: HttpClient) { }

  submitQuiz(q: IQuiz): Observable<any> {
    const token: string = localStorage.getItem('token') || "";
    console.log(token);

    const headers = new HttpHeaders({
      'token': token,
      'Content-Type': 'application/json'
    });

    return this.http.post(
      'https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/exam',
      q,
      { headers }
    );
  }



}