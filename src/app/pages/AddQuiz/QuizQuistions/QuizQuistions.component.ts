import { Component, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion, QuizService } from '../Quize.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-QuizQuistions',
  templateUrl: './QuizQuistions.component.html',
  styleUrls: ['./QuizQuistions.component.css'],
  imports: [QuestionComponent, FormsModule]

})
export class QuizQuistionsComponent implements OnInit {
  @Input() questions !: IQuestion[]
  @Input() quizName: string = ""
  duration: string = ""
  grade!: Number
  constructor(private _quizService: QuizService, private router: Router) { }

  ngOnInit() {
    console.log("object from anas", this._quizService.quiz)
  }
  handleDeleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }
  handelAddQuestion() {
    this.questions = [
      ...this.questions,
      {
        theQuestion: "",
        options: [
          { key: "A", option: "", isCorrect: false },
          { key: "B", option: "", isCorrect: false },
        ],
      },
    ];
    console.log(this.questions);
  }
  handelOnSubmit() {
    this._quizService.quiz.name = this.quizName;
    this._quizService.quiz.questions = this.questions;
    this._quizService.quiz.duration = this.duration;
    this._quizService.quiz.grade = Number(this.grade)
    this._quizService.submitQuiz(this._quizService.quiz).subscribe({
      next: (res) => {
        console.log('Quiz submitted successfully:', res);
        this.router.navigate(['/teacherViewExams']);
      },
      error: (err) => {
        console.error('Submission error:', err);
        alert('Failed to submit quiz.');
      }
    });
  }
}
