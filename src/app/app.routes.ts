import { Routes } from '@angular/router';

// import { AllTeacherExamsComponent } from './pages/teachers/teacher-exams/all-teacher-exams.component';
import { ExamQuestionsComponent } from './pages/exams/exam-questions/exam-questions.component';
import { TeacherExamsComponent } from './pages/teachers/teacher-exams/teacher-exams.component';
import { ExamResultComponent } from './pages/exams/exam-result/exam-result/exam-result.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FeaturesComponent } from './components/features/features.component';
import { PrivacyPolicyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { CookieComponent } from './components/cookie/cookie.component';

import { AuthGuard } from './Core/auth/auth.guard';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'teachers/:teacherId/exams',
    component: TeacherExamsComponent,
    canActivate: [AuthGuard],
    data: { renderMode: 'client' }, // ✅ منع الـ prerender هنا
  },
  {
    path: 'exam/:examId',
    component: ExamQuestionsComponent,
    canActivate: [AuthGuard],
    data: { renderMode: 'client' }, // اختياري لو فيها مشاكل
  },
  {
    path: 'exam-result/:id',
    component: ExamResultComponent,
    canActivate: [AuthGuard],
    data: { renderMode: 'client' }, // ✅ منع الـ prerender هنا
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'features',
    component: FeaturesComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'cookie',
    component: CookieComponent,
  },
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
    canActivate: [AuthGuard],
  },
  {
    path: 'view-quiz/:id/:length',
    loadComponent: () =>
      import('./pages/viewResult/viewResult.component').then(
        (m) => m.ViewResultComponent
      ),
    canActivate: [AuthGuard],
    data: { renderMode: 'client' }, // ✅ منع الـ prerender هنا
  },
  {
    path: 'teacherViewExams',
    loadComponent: () =>
      import('./pages/teacherView/teacherView.component').then(
        (m) => m.TeacherViewComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'editQuiz/:id',
    loadComponent: () =>
      import('./pages/EditQuiz/EditQuiz.component').then(
        (m) => m.EditQuizComponent
      ),
    canActivate: [AuthGuard],
    data: { renderMode: 'client' }, // ✅ منع الـ prerender هنا
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/ContactUs/ContactUs.component').then(
        (m) => m.ContactUsComponent
      ),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./components/pricing/pricing.component').then(
        (m) => m.PricingComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

