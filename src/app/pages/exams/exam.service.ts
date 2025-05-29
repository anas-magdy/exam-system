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
      duration: 90, // 90 minutes
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
        // Add more questions...
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
