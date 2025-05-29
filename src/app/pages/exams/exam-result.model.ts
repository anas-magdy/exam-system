export interface ExamResult {
  examId: string;
  studentId: string;
  answers: number[]; // indices of selected answers
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: Date;
}
