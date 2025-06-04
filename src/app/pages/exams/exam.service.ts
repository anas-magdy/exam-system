import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Exam } from './exam.model';
import { ExamResult } from './exam-result.model';
import { map } from 'rxjs/operators';

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
          duration: Number(data.duration), // ← مهم جداً لو كانت سترينج
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
              this.submitExam(this.answers);
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

  submitExam(answers: number[]) {
    const exam = this.currentExam$.value;
    if (!exam) return null;

    this.answers = answers;

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
      studentId: 'current-student-id', // Replace with real ID later
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
