import { Routes } from '@angular/router';
import { AllTeacherExamsComponent } from './pages/teachers/teacher-exams/all-teacher-exams.component';

import { ExamStartComponent } from './pages/exams/exam-start/exam-start.component';
import { ExamQuestionsComponent } from './pages/exams/exam-questions/exam-questions.component';
import { ExamResultComponent } from './pages/exams/exam-result/exam-result.component';

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
  { path: 'teachers/:teacherId/exams', component: AllTeacherExamsComponent },
  {
    path: 'exam/:examId/start',
    component: ExamStartComponent,
  },
  {
    path: 'exam/questions',
    component: ExamQuestionsComponent,
  },
  {
    path: 'exam-result/:examId',
    component: ExamResultComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Core/Login/Login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Core/Regestaer/Regestaer.component').then(
        (m) => m.RegestaerComponent
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
];
