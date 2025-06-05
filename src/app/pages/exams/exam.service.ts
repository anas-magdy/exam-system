import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  timer,
  Subscription,
  Observable,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Exam } from './exam.model';
import { ExamResult } from './exam-result.model';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private currentExam$ = new BehaviorSubject<Exam | null>(null);
  private examTimer$ = new BehaviorSubject<number>(0);
  private examEnded$ = new BehaviorSubject<boolean>(false);

  private answers: number[] = [];

  constructor(private http: HttpClient) {}

  fetchExamFromApi(examId: string) {
    const url = `https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/exam/${examId}`;

    // ✅ نحاول نجيب التوكن من localStorage
    const localToken = localStorage.getItem('token');

    // ✅ لو مفيش توكن، نستخدم الافتراضي
    const token =
      localToken ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyZDUwOGUyLWM5MDktNDU2My05NTI2LTQ2ZDc4MmQwOWUyMiIsInJvbGUiOiJTVFVERU5UIiwiZW1haWwiOiJzYXllZGRkQGdtYWlsLmNvbSIsImlhdCI6MTc0ODk3NTEwOSwiZXhwIjoxNzQ5NTc5OTA5fQ.snfUVJ1noAbTZU3lmRBjOdYf86RQJdT1W-0uMV_Y99s'; // ← ضيف التوكن الافتراضي هنا

    const headers = new HttpHeaders({
      token: token, // بدون Bearer
    });

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => {
        const data = response.data;
        return {
          id: data.id,
          title: data.name,
          description: '',
          duration: Number(data.duration),
          teacherId: data.teacherId,
          questions: data.questions.map((q: any) => {
            const correctIndex = q.options.findIndex(
              (opt: any) => opt.isCorrect
            );
            return {
              id: q.id,
              text: q.theQuestion,
              options: q.options,
              correctAnswer: correctIndex,
              points: 10,
            };
          }),
        } as Exam;
      })
    );
  }

  private timerSubscription: Subscription | null = null;

  startExam(examId: string): Observable<boolean> {
    return new Observable((observer) => {
      this.fetchExamFromApi(examId).subscribe({
        next: (exam) => {
          this.currentExam$.next(exam);
          this.answers = new Array(exam.questions.length).fill(-1);

          const totalSeconds = Number(exam.duration) * 60;
          this.examTimer$.next(totalSeconds);

          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }

          this.timerSubscription = timer(0, 1000).subscribe(() => {
            const current = this.examTimer$.value;
            if (current > 0) {
              this.examTimer$.next(current - 1);
            } else {
              this.submitExam(this.answers).subscribe({
                next: (result) => {
                  console.log('Exam auto-submitted on timeout:', result);
                },
                error: (err) => {
                  console.error('Auto-submit failed:', err);
                },
              });
              this.timerSubscription?.unsubscribe();
            }
          });

          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('Error starting exam:', err);
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  submitExamToApi(): Observable<any> {
    const exam = this.currentExam$.value;
    if (!exam) {
      return throwError(() => new Error('No exam found'));
    }

    const localToken = localStorage.getItem('token');
    const token = localToken || 'your-default-token';

    const headers = new HttpHeaders({ token });

    const body = {
      examId: exam.id,
      answers: this.answers
        .map((answerIdx, i) => {
          if (answerIdx === -1) return null;
          const question = exam.questions[i];
          const option = question.options[answerIdx];
          if (!option) return null;
          return {
            questionId: question.id,
            optionId: option.id,
          };
        })
        .filter(Boolean),
    };

    return this.http.post<any>(
      'https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/student',
      body,
      { headers }
    );
  }

  submitExam(answers: number[]): Observable<ExamResult> {
    const exam = this.currentExam$.value;
    if (!exam) return throwError(() => new Error('No exam loaded'));

    this.answers = answers;

    return this.submitExamToApi().pipe(
      map((response) => {
        const scoreFromApi = response.data.score;
        const studentId = response.data.studentId;
        const totalQuestions = response.totalQuestions;

        const totalScore = totalQuestions * 10; // 🔥 نحسبها من السيرفر
        const percentage = Math.round((scoreFromApi / totalScore) * 100);

        const result: ExamResult = {
          examId: exam.id,
          studentId: studentId,
          answers,
          score: scoreFromApi,
          totalScore,
          percentage,
          submittedAt: new Date(),
        };

        this.saveResult(result);
        return result;
      })
    );
  }

  endExam() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.currentExam$.value) {
      this.submitExam(this.answers);
    }
    this.examEnded$.next(true);
  }

  private saveResult(result: ExamResult) {
    console.log('Exam result saved:', result);
    localStorage.setItem(
      `exam-result-${result.examId}`,
      JSON.stringify(result)
    );
  }

  setCurrentExam(exam: Exam) {
    this.currentExam$.next(exam);
  }

  setExamTimer(seconds: number) {
    this.examTimer$.next(seconds);
  }

  getCurrentExam() {
    return this.currentExam$.asObservable();
  }

  getExamTimer() {
    return this.examTimer$.asObservable();
  }

  getExamEnded() {
    return this.examEnded$.asObservable();
  }
}
