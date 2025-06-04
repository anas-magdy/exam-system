import { Component, input, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion, EditQuizService } from '../EditQuiz.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-QuizQuistions',
  templateUrl: './QuizQuistions.component.html',
  styleUrls: ['./QuizQuistions.component.css'],
  imports: [QuestionComponent, FormsModule,]

})
export class QuizQuistionsComponent implements OnInit {
  @Input() questions !: IQuestion[]
  @Input() quizName!: string
  @Input() duration!: string
  @Input() grade!: Number
  constructor(
    private _EditQuizService: EditQuizService,
    private route: ActivatedRoute,
    private router: Router) { }
  quizId!: any
  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id')

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
  handelOnSave() {
    this._EditQuizService.quiz = {
      name: this.quizName,
      questions: this.questions,
      duration: this.duration,
      grade: Number(this.grade),
    };

    this._EditQuizService.editQuiz(this._EditQuizService.quiz, this.quizId).subscribe({
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
