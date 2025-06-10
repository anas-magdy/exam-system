import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TeacherGetExamsService {
  private apiBaseUrl = environment.apiBaseUrl; // استخدام المتغير من environment

  constructor(private http: HttpClient) {}

  getTeacherExams(): Observable<any> {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode<any>(token!);
    console.log('Teacher ID:', decoded.id);

    return this.http.get(`${this.apiBaseUrl}/teacher/${decoded.id}/exams`);
  }

  deleteExam(examId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', `${token}`);

    return this.http.delete(`${this.apiBaseUrl}/exam/${examId}`, { headers });
  }
}
