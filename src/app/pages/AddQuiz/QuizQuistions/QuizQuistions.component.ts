import { Component, Input, OnInit } from '@angular/core';
import { QuestionComponent } from './Question/Question.component';
import { IQuestion, QuizService } from '../Quize.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-QuizQuistions',
  templateUrl: './QuizQuistions.component.html',
  styleUrls: ['./QuizQuistions.component.css'],
  imports: [QuestionComponent, FormsModule, CommonModule]

})
export class QuizQuistionsComponent implements OnInit {
  @Input() questions !: IQuestion[]
  @Input() quizName: string = ""
  duration: string = ""
  grade!: Number
  activeIndex: number = 0;
  constructor(private _quizService: QuizService, private router: Router) { }

  toggleAccordion(index: number) {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }
  ngOnInit() {
    console.log("object from anas", this._quizService.quiz)
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
    this.activeIndex = this.questions.length - 1;
    console.log(this.questions);
  }
  handelOnSubmit() {


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
        text:'Please fill in the quiz name, duration, and grade before submitting.',
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
    this._quizService.quiz.name = this.quizName;
    this._quizService.quiz.questions = this.questions;
    this._quizService.quiz.duration = this.duration;
    this._quizService.quiz.grade = Number(this.grade)
    this._quizService.submitQuiz(this._quizService.quiz).subscribe({
      next: (res) => {
        console.log('Quiz submitted successfully:', res);
        // Swal.fire({
        //   icon: 'success',
        //   title: 'تم الإرسال',
        //   text: 'تم إرسال الاختبار بنجاح!',
        //   timer: 1000,
        //   showConfirmButton: false
        // });
        this.router.navigate(['/teacherViewExams']);
      },
      error: (err) => {
        console.error('Submission error:', err);
      //         Swal.fire({
      //   icon: 'error',
      //   title: 'فشل الإرسال',
      //   text: 'حدث خطأ أثناء إرسال الاختبار. حاول مرة أخرى.',
      // });

      }
    });
  }
}
