import { Component, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion, QuizService } from '../Quize.service';

@Component({
  selector: 'app-QuizQuistions',
  templateUrl: './QuizQuistions.component.html',
  styleUrls: ['./QuizQuistions.component.css'],
  imports: [QuestionComponent]

})
export class QuizQuistionsComponent implements OnInit {
  @Input() questions !: IQuestion[]
  constructor(private _quizService: QuizService) { }

  ngOnInit() {
    console.log("object from anas", this._quizService.quiz)
  }
  handelAddQuestion() {
    this.questions = [
      ...this.questions,
      {
        question: '',
        Choices: [
          { key: "A", value: "" },
          { key: "B", value: "" }
        ],
        correct: ''
      }
    ];
    console.log(this.questions);
  }
  handelOnSubmit() {
    this._quizService.quiz.questions = this.questions
    console.log(this._quizService.quiz)
  }
}
