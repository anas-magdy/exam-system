
import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identity, Observable, of } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class TeacherGetExamsService {
  constructor(private http: HttpClient) { }

  getTeacherExams(): Observable<any> {
    const token = localStorage.getItem('token');
   
    const decoded = jwtDecode<any>(token!);
    console.log("aaaaaaaaaaaaaaanas",decoded.id)
    return this.http.get(`https://static-teri-sayedmahmoud223-ec4bee33.koyeb.app/api/v1/teacher/${decoded.id}/exams`);
  }



  // getTeacherExams: Observable<any>() {
  //   const token = localStorage.getItem('token');
  //   const decodedToken: any = jwtDecode(token);
  // console.log(decodedToken)
  // return this.http.get(`https://exam-management-sys-beta.vercel.app/api/v1/teacher/${teacherId}/exams`);
  // const teacherId = decodedToken.id; // Assuming the token contains the teacher ID in the 'id' field

  // }
}