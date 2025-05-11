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
          { key: "a", value: "London" },
          { key: "b", value: "Paris" },
          { key: "c", value: "Berlin" },
          { key: "d", value: "Madrid" }
        ],
        correct: "b"
      },
      {
        question: "Which planet is known as the Red Planet?",
        Choices: [
          { key: "a", value: "London" },
          { key: "b", value: "Paris" },

        ],
        correct: "b"
      },
      {
        question: "What is the largest mammal in the world?",
        Choices: [
          { key: "a", value: "London" },
          { key: "b", value: "Paris" },
          { key: "c", value: "Berlin" },
        ],
        correct: "b"
      }
    ]
  };

  constructor() { }
}