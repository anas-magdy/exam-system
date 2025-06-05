export interface ExamResult {
  examId: string;
  studentId: string;
  answers: number[];
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: Date;
}
