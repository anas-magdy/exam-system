import { Injectable } from '@angular/core';

export interface IQuiz {
  id: number;
  name: string;
  questions: IQuestion[];
}
export interface IQuestion {
  question: string;
  Choices: IChoice[];
  correct: string;
}
export interface IChoice {
  key: string;
  value: string;
}
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quiz: IQuiz = {
    id: 1,
    name: "General Knowledge Quiz",
    questions: [
      {
        question: "What is the capital of France?",
        Choices: [
          { key: "a", value: "" },
          { key: "b", value: "" },
        ],
        correct: "b"
      },
   
    ]
  };

  constructor() { }
}