import { IQuiz, QuizService } from './Quize.service';
import { Component, OnInit } from '@angular/core';
import { QuizNameComponent } from './QuizName/QuizName.component';
import { QuizQuistionsComponent } from './QuizQuistions/QuizQuistions.component';

@Component({
  selector: 'app-AddQuiz',
  templateUrl: './AddQuiz.component.html',
  styleUrls: ['./AddQuiz.component.css'],
  imports: [QuizNameComponent, QuizQuistionsComponent]
})
export class AddQuizComponent implements OnInit {
  quizData!: IQuiz
  constructor(private _quizService: QuizService) { }

  ngOnInit() {
    this.quizData = this._quizService.quiz
    console.log(this.quizData)
  }

}
