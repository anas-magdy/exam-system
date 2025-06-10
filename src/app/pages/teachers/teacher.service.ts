import { environment } from '../../../../src/environments/environments';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
export interface Teacher {
  id: string;
  userId: string;
  subjectName: string;
  idCardImage: {
    public_id: string;
    secure_url: string;
  };
  idCardData: {
    role: string;
    syndicate: string;
    doctorName: string;
    expiryDate: string;
    secretaryGeneral: string;
  };
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    age: number;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  Exam?: Exam[];
  examCount?: number;
}

export interface Exam {
  id: string;
  name: string;
  teacherId: string;
  duration?: string; // أو number لو ال API بترجع رقم
  grade?: number;
  questions: {
    id: string;
    theQuestion: string;
    examId: string;
    options: {
      id: string;
      option: string;
      key: string;
      isCorrect: boolean;
      questionId: string;
    }[];
  }[];
  questionsCount?: number;
}

export interface TeacherWithExams {
  id: string;
  user: {
    name: string;
    // باقي خصائص المستخدم
  };
  idCardImage: {
    secure_url: string;
  };
  subjectName: string;
  Exam: Exam[];
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = `${environment.apiBaseUrl}/teacher`;
  private cachedTeachers: Teacher[] = [];

  constructor(private http: HttpClient) {}
  getAllTeachers(): Observable<Teacher[]> {
    if (this.cachedTeachers.length > 0) {
      return of(this.cachedTeachers);
    }

    return this.http
      .get<{ message: string; data: Teacher[] }>(this.apiUrl)
      .pipe(
        map((response) => {
          const teachersWithExamCount = response.data.map((teacher) => ({
            ...teacher,
            examCount: teacher.Exam?.length || 0,
          }));

          this.cachedTeachers = teachersWithExamCount;
          return teachersWithExamCount;
        })
      );
  }

  searchTeachers(
    query: string,
    subjectFilter: string = ''
  ): Observable<Teacher[]> {
    if (this.cachedTeachers.length > 0) {
      const filteredTeachers = this.cachedTeachers.filter((teacher) => {
        const matchesSearch = teacher.user.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesSubject =
          !subjectFilter || teacher.subjectName === subjectFilter;
        return matchesSearch && matchesSubject;
      });
      return of(filteredTeachers);
    }

    return this.getAllTeachers().pipe(
      map((teachers) =>
        teachers.filter((teacher) => {
          const matchesSearch = teacher.user.name
            .toLowerCase()
            .includes(query.toLowerCase());
          const matchesSubject =
            !subjectFilter || teacher.subjectName === subjectFilter;
          return matchesSearch && matchesSubject;
        })
      )
    );
  }

  getTeacherById(id: string): Observable<Teacher | undefined> {
    return this.getAllTeachers().pipe(
      map((teachers) => teachers.find((teacher) => teacher.id === id))
    );
  }

  getTeacherExams(teacherId: string): Observable<any[]> {
    return this.http
      .get<{ message: string; data: any }>(`${this.apiUrl}/${teacherId}/exams`)
      .pipe(map((response) => response.data.Exam || []));
  }

  getTeacherExamCount(teacherId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${teacherId}/exams/count`);
  }
  getTeacherSubjects(): Observable<string[]> {
    return this.getAllTeachers().pipe(
      map((teachers) => [
        ...new Set(teachers.map((teacher) => teacher.subjectName)),
      ])
    );
  }

  getTeacherWithExams(teacherId: string): Observable<TeacherWithExams> {
    return this.http
      .get<{ message: string; data: TeacherWithExams }>(
        `${this.apiUrl}/${teacherId}/exams`
      )
      .pipe(
        map((response) => {
          const teacherData = response.data;
          teacherData.Exam = teacherData.Exam.map((exam) => ({
            ...exam,
            questionsCount: exam.questions.length,
          }));
          return teacherData;
        }),
        catchError((error) => {
          if (
            error.error &&
            error.error.message === 'teacher exams not exist'
          ) {
            return of({
              id: '',
              user: { name: '' },
              idCardImage: { secure_url: '' },
              subjectName: '',
              Exam: [],
            });
          }

          let errorMessage = 'Error when fetching exams';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  refreshTeachers(): Observable<Teacher[]> {
    this.cachedTeachers = [];
    return this.getAllTeachers();
  }
}
