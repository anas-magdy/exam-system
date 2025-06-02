// exam.model.ts
export interface Teacher {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  teacherId: string;
  questions: Question[];
}

export interface ExamResult {
  examId: string;
  studentId: string;
  answers: number[];
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: Date;
}
