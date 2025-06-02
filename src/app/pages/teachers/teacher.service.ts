import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Teacher,
  TeacherResponse,
  TeacherExam,
} from './../../models/Teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'https://exam-management-sys-beta.vercel.app/api/v1';
  // private apiUrl = '/api/api/v1';

  constructor(private http: HttpClient) {}

  // جلب جميع المعلمين
  getAllTeachers(): Observable<Teacher[]> {
    return this.http
      .get<TeacherResponse>(`${this.apiUrl}/teacher`)
      .pipe(map((response) => response.data));
  }

  // جلب بيانات معلم محدد بالـ ID
  getTeacherById(teacherId: string): Observable<Teacher> {
    return this.http
      .get<{ message: string; data: Teacher }>(
        `${this.apiUrl}/teacher/${teacherId}`
      )
      .pipe(map((response) => response.data));
  }

  // جلب امتحانات معلم محدد - الآن من teacher response نفسه
  getTeacherExams(teacherId: string): Observable<TeacherExam[]> {
    return this.http
      .get<{ data: TeacherExam[] }>(`${this.apiUrl}/teacher/${teacherId}/exams`)
      .pipe(
        map((response) => response.data || []),
        catchError(() => of([])) // في حالة الخطأ نرجع مصفوفة فارغة
      );
  }
}
