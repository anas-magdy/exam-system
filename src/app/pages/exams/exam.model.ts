export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of the correct option
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  teacherId: string;
  startTime?: Date; // will be set when exam starts
  endTime?: Date; // will be set when exam starts
}
