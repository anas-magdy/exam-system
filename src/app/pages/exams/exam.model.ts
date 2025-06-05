// exam.model.ts
export interface Teacher {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

export interface Option {
  id: string;
  option: string;
  key: string;
  isCorrect: boolean;
  questionId: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[]; // بدل string[] هنا كائنات Option
  correctAnswer: number; // ممكن تحذفها لو تستخدم isCorrect من الخيارات بدل الفهرس
  points: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string; // ممكن تخليه optional لو مش موجود في API
  duration: number; // دقائق
  teacherId: string;
  questions: Question[];
}
