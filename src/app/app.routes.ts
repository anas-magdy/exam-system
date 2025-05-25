import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    { path: 'login', loadComponent: () => import('./Core/Login/Login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./Core/Regestaer/Regestaer.component').then(m => m.RegestaerComponent) },
    { path: 'add-quiz', loadComponent: () => import('./pages/AddQuiz/AddQuiz.component').then(m => m.AddQuizComponent) },
    { path: 'view-quiz/:id', loadComponent: () => import('./pages/viewResult/viewResult.component').then(m => m.ViewResultComponent) },
    { path: 'teacher-view', loadComponent: () => import('./pages/teacherView/teacherView.component').then(m => m.TeacherViewComponent) }
];
