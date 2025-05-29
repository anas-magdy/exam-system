import { Injectable } from '@angular/core';
import { Exam, Question } from './exam.model';
import { ExamResult } from './exam-result.model';
import { BehaviorSubject, timer, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private currentExam$ = new BehaviorSubject<Exam | null>(null);
  private examTimer$ = new BehaviorSubject<number>(0);
  private examEnded$ = new BehaviorSubject<boolean>(false);
  // Mock data - in real app you'd fetch from API
  private answers: number[] = [];
  private exams: Exam[] = [
    {
      id: '1',
      title: 'Midterm Exam',
      description: 'Covers chapters 1-5',
      duration: 90, // minutes
      teacherId: '1',
      questions: [
        {
          id: '1',
          text: 'What is Angular?',
          options: [
            'A programming language',
            'A JavaScript framework',
            'A database system',
            'An operating system',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: '2',
          text: 'Which decorator is used to define a component in Angular?',
          options: ['@Component', '@NgModule', '@Directive', '@Injectable'],
          correctAnswer: 0,
          points: 15,
        },
        {
          id: '3',
          text: 'What is data binding in Angular?',
          options: [
            'A way to connect application data with DOM',
            'A database connection method',
            'A type of HTTP request',
            'A security protocol',
          ],
          correctAnswer: 0,
          points: 12,
        },
        {
          id: '4',
          text: 'Which of these is NOT a lifecycle hook?',
          options: ['ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngRender'],
          correctAnswer: 3,
          points: 10,
        },
        {
          id: '5',
          text: 'What does RxJS stand for?',
          options: [
            'Reactive Extensions for JavaScript',
            'React JavaScript Syntax',
            'Runtime XML JavaScript',
            'Remote XHR JavaScript Service',
          ],
          correctAnswer: 0,
          points: 8,
        },
      ],
    },
    {
      id: '2',
      title: 'Final Exam',
      description: 'Comprehensive exam covering all chapters',
      duration: 120,
      teacherId: '1',
      questions: [
        {
          id: '6',
          text: 'What is the purpose of Angular services?',
          options: [
            'To create components',
            'To share data and logic across components',
            'To define routes',
            'To create templates',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '7',
          text: 'How do you generate a new service in Angular CLI?',
          options: [
            'ng generate component service-name',
            'ng generate service service-name',
            'ng create service service-name',
            'ng new service service-name',
          ],
          correctAnswer: 1,
          points: 10,
        },
      ],
    },
    {
      id: '3',
      title: 'React Basics Test',
      description: 'JSX and Components fundamentals',
      duration: 60,
      teacherId: '2',
      questions: [
        {
          id: '8',
          text: 'What is JSX?',
          options: [
            'A JavaScript testing framework',
            'JavaScript XML syntax extension',
            'A state management library',
            'A build tool for React',
          ],
          correctAnswer: 1,
          points: 12,
        },
        {
          id: '9',
          text: 'In React, props are:',
          options: [
            'Mutable within the component',
            'Used to store internal state',
            'Passed from parent to child components',
            'Only for class components',
          ],
          correctAnswer: 2,
          points: 15,
        },
      ],
    },
    {
      id: '4',
      title: 'Vue.js Fundamentals',
      description: 'Basic concepts of Vue.js',
      duration: 75,
      teacherId: '3',
      questions: [
        {
          id: '10',
          text: 'Which Vue directive is used for conditional rendering?',
          options: ['v-for', 'v-if', 'v-bind', 'v-model'],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: '11',
          text: 'What is the correct way to create a Vue instance?',
          options: [
            'new Vue({ /* options */ })',
            'Vue.create({ /* options */ })',
            'Vue.component({ /* options */ })',
            'Vue.instantiate({ /* options */ })',
          ],
          correctAnswer: 0,
          points: 12,
        },
      ],
    },
  ];

  startExam(examId: string) {
    const exam = this.getExamDetails(examId);
    if (!exam) return;

    // بدء المؤقت
    const totalSeconds = exam.duration * 60;
    this.examTimer$.next(totalSeconds);

    timer(0, 1000).subscribe(() => {
      const remaining = this.examTimer$.value - 1;
      this.examTimer$.next(remaining);

      if (remaining <= 0) {
        this.submitExam(this.answers);
      }
    });

    this.currentExam$.next(exam);
  }

  submitExam(answers: number[]) {
    const exam = this.currentExam$.value;
    if (!exam) return null;

    this.answers = answers; // حفظ الإجابات

    let score = 0;
    answers.forEach((answerIdx, questionIdx) => {
      if (answerIdx === exam.questions[questionIdx].correctAnswer) {
        score += exam.questions[questionIdx].points;
      }
    });

    const totalScore = exam.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalScore) * 100);

    const result: ExamResult = {
      examId: exam.id,
      studentId: 'current-student-id',
      answers,
      score,
      totalScore,
      percentage,
      submittedAt: new Date(),
    };

    this.saveResult(result);
    return result;
  }
  endExam() {
    if (this.currentExam$.value) {
      this.submitExam(this.answers);
    }
    this.examEnded$.next(true);
  }

  private saveResult(result: ExamResult) {
    // In real app, send to API
    console.log('Exam result saved:', result);
    // Store in local storage for demo purposes
    localStorage.setItem(
      `exam-result-${result.examId}`,
      JSON.stringify(result)
    );
  }

  getCurrentExam() {
    return this.currentExam$.asObservable();
  }
  getExamDetails(examId: string): Exam | undefined {
    return this.exams.find((exam) => exam.id === examId);
  }
  getExamTimer() {
    return this.examTimer$.asObservable();
  }
}
