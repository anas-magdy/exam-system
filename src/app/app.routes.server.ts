import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // استثناء كل الصفحات الديناميكية
  {
    path: 'teachers/:teacherId/exams',
    renderMode: RenderMode.Client
  },
  {
    path: 'exam/:examId',
    renderMode: RenderMode.Client
  },
  {
    path: 'exam-result/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'view-quiz/:id/:length',
    renderMode: RenderMode.Client
  },
  {
    path: 'editQuiz/:id',
    renderMode: RenderMode.Client
  },

  // باقي الصفحات تستخدم prerender عادي
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
