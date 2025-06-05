import { Component, input, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion, EditQuizService } from '../EditQuiz.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  handleDeleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }
  handelAddQuestion() {
    const lastQuestion = this.questions[this.questions.length - 1];
    if (lastQuestion) {
      const isQuestionValid =
        lastQuestion.theQuestion.trim() !== '' &&
        lastQuestion.options.every(opt => opt.option.trim() !== '') &&
        lastQuestion.options.some(opt => opt.isCorrect);
      if (!isQuestionValid) {
        Swal.fire({
          icon: 'warning',
          title: 'warning',
          text: 'Check the previous question!',
        });
        return;
      }
    }
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

    if (
      this.quizName.trim() === '' ||
      this.duration.trim() === '' ||
      this.grade === undefined ||
      this.grade === null ||
      isNaN(Number(this.grade))
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please fill in the quiz name, duration, and grade before submitting.',
      });
      return;
    }
    const allQuestionsValid = this.questions.every((q, index) =>
      q.theQuestion.trim() !== '' &&
      q.options.every(opt => opt.option.trim() !== '') &&
      q.options.some(opt => opt.isCorrect)
    );
    if (!allQuestionsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Check questions',
        text: 'Some questions are incomplete. Make sure you write the question and options and select the correct answer..',
      });
      return;
    }




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
