import { Routes } from '@angular/router';
// import { AllTeacherExamsComponent } from './pages/teachers/teacher-exams/all-teacher-exams.component';

import { ExamQuestionsComponent } from './pages/exams/exam-questions/exam-questions.component';
import { TeacherExamsComponent } from './pages/teachers/teacher-exams/teacher-exams.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./pages/teachers/teachers.component').then(
        (m) => m.TeachersComponent
      ),
  },
  { path: 'teachers/:teacherId/exams', component: TeacherExamsComponent },
  { path: 'exam/:examId', component: ExamQuestionsComponent },

  // { path: 'teachers/:teacherId/exams', component: AllTeacherExamsComponent },
  // {
  //   path: 'exam/:examId/start',
  //   component: ExamStartComponent,
  // },
  // {
  //   path: 'exam/questions',
  //   component: ExamQuestionsComponent,
  // },
  // {
  //   path: 'exam-result/:examId',
  //   component: ExamResultComponent,
  // },
  {
    path: 'login',
    loadComponent: () =>
      import('./Core/Login/Login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Core/Register/Register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'add-quiz',
    loadComponent: () =>
      import('./pages/AddQuiz/AddQuiz.component').then(
        (m) => m.AddQuizComponent
      ),
  },
  {
    path: 'view-quiz/:id',
    loadComponent: () =>
      import('./pages/viewResult/viewResult.component').then(
        (m) => m.ViewResultComponent
      ),
  },
  {
    path: 'teacherViewExams',
    loadComponent: () =>
      import('./pages/teacherView/teacherView.component').then(
        (m) => m.TeacherViewComponent
      ),
  },
];
