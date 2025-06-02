export interface TeacherResponse {
  message: string;
  data: Teacher[];
}

export interface Teacher {
  id: string;
  userId: string;
  subjectName: string;
  idCardImage: {
    public_id: string;
    secure_url: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    role: string;
    createdAt: string;
    udatedAt: string;
  };
  idCardData: {
    role: string;
    syndicate: string;
    doctorName: string;
    expiryDate: string;
    secretaryGeneral: string;
  };
  status: string;
  // إضافة الامتحانات للـ teacher model
  Exam?: TeacherExam[];
}

export interface TeacherExam {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  teacherId: string;
}

export interface TeacherExam {
  id: string;
  name: string;
  teacherId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  theQuestion: string;
  examId: string;
  options: Option[];
}

export interface Option {
  id: string;
  option: string;
  key: string;
  isCorrect: boolean;
  questionId: string;
}
