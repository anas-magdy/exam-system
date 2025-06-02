import { Injectable } from '@angular/core';
import { Exam, Question } from './exam.model';
import { ExamResult } from './exam-result.model';
import { BehaviorSubject, timer, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private currentExam$ = new BehaviorSubject<Exam | null>(null);
  private examTimer$ = new BehaviorSubject<number>(0);
  private examEnded$ = new BehaviorSubject<boolean>(false);
  // Mock data - in real app you'd fetch from API
  private answers: number[] = [];
  private exams: Exam[] = [
    // امتحانات Bonnie Green (Angular Developer) - teacherId: '1'
    {
      id: '1',
      title: 'Midterm Exam',
      description: 'Covers chapters 1-5',
      duration: 90,
      teacherId: '1',
      questions: [
        {
          id: '1',
          text: 'What is Angular?',
          options: [
            'A programming language',
            'A JavaScript framework',
            'A database system',
            'An operating system',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: '2',
          text: 'Which decorator is used to define a component in Angular?',
          options: ['@Component', '@NgModule', '@Directive', '@Injectable'],
          correctAnswer: 0,
          points: 15,
        },
        {
          id: '3',
          text: 'What is data binding in Angular?',
          options: [
            'A way to connect application data with DOM',
            'A database connection method',
            'A type of HTTP request',
            'A security protocol',
          ],
          correctAnswer: 0,
          points: 12,
        },
      ],
    },
    {
      id: '2',
      title: 'Final Exam',
      description: 'Comprehensive exam',
      duration: 120,
      teacherId: '1',
      questions: [
        {
          id: '4',
          text: 'What is the purpose of Angular services?',
          options: [
            'To create components',
            'To share data and logic across components',
            'To define routes',
            'To create templates',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '5',
          text: 'How do you generate a new service in Angular CLI?',
          options: [
            'ng generate component service-name',
            'ng generate service service-name',
            'ng create service service-name',
            'ng new service service-name',
          ],
          correctAnswer: 1,
          points: 10,
        },
      ],
    },

    // امتحانات Ahmed Ali (React Developer) - teacherId: '2'
    {
      id: '3',
      title: 'React Basics Test',
      description: 'JSX and Components',
      duration: 60,
      teacherId: '2',
      questions: [
        {
          id: '6',
          text: 'What is JSX?',
          options: [
            'A JavaScript testing framework',
            'JavaScript XML syntax extension',
            'A state management library',
            'A build tool for React',
          ],
          correctAnswer: 1,
          points: 12,
        },
        {
          id: '7',
          text: 'In React, props are:',
          options: [
            'Mutable within the component',
            'Used to store internal state',
            'Passed from parent to child components',
            'Only for class components',
          ],
          correctAnswer: 2,
          points: 15,
        },
      ],
    },
    {
      id: '4',
      title: 'Advanced React',
      description: 'Hooks and Context API',
      duration: 90,
      teacherId: '2',
      questions: [
        {
          id: '8',
          text: 'What is the useState hook used for?',
          options: [
            'Managing component lifecycle',
            'Managing local component state',
            'Making HTTP requests',
            'Handling events',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '9',
          text: 'Which hook is used for side effects?',
          options: ['useState', 'useContext', 'useEffect', 'useReducer'],
          correctAnswer: 2,
          points: 12,
        },
      ],
    },

    // امتحانات Layla Hassan (Vue.js Expert) - teacherId: '3'
    {
      id: '5',
      title: 'Vue.js Fundamentals',
      description: 'Vue directives and components',
      duration: 75,
      teacherId: '3',
      questions: [
        {
          id: '10',
          text: 'Which Vue directive is used for conditional rendering?',
          options: ['v-for', 'v-if', 'v-bind', 'v-model'],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: '11',
          text: 'What is the correct way to create a Vue instance?',
          options: [
            'new Vue({ /* options */ })',
            'Vue.create({ /* options */ })',
            'Vue.component({ /* options */ })',
            'Vue.instantiate({ /* options */ })',
          ],
          correctAnswer: 0,
          points: 12,
        },
      ],
    },

    // امتحانات Mohamed Zidan (Full Stack Developer) - teacherId: '4'
    {
      id: '6',
      title: 'Full Stack Project',
      description: 'End-to-end application development',
      duration: 180,
      teacherId: '4',
      questions: [
        {
          id: '12',
          text: 'What is REST API?',
          options: [
            'A programming language',
            'A database system',
            'An architectural style for web services',
            'A frontend framework',
          ],
          correctAnswer: 2,
          points: 20,
        },
        {
          id: '13',
          text: 'Which HTTP method is used to update data?',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correctAnswer: 2,
          points: 15,
        },
      ],
    },

    // امتحانات Sara Ibrahim (UI/UX Designer) - teacherId: '5'
    {
      id: '7',
      title: 'UI Design Principles',
      description: 'Color theory and typography',
      duration: 90,
      teacherId: '5',
      questions: [
        {
          id: '14',
          text: 'What are the primary colors?',
          options: [
            'Red, Green, Blue',
            'Red, Yellow, Blue',
            'Red, Orange, Yellow',
            'Blue, Green, Purple',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: '15',
          text: 'What is typography?',
          options: [
            'Art of arranging type',
            'Color selection process',
            'Image editing technique',
            'Layout methodology',
          ],
          correctAnswer: 0,
          points: 12,
        },
      ],
    },
    {
      id: '8',
      title: 'UX Research',
      description: 'User testing methodologies',
      duration: 120,
      teacherId: '5',
      questions: [
        {
          id: '16',
          text: 'What is user persona?',
          options: [
            'A real user',
            'A fictional character representing user group',
            'A testing method',
            'A design pattern',
          ],
          correctAnswer: 1,
          points: 15,
        },
      ],
    },

    // امتحانات John Carter (Node.js Developer) - teacherId: '6'
    {
      id: '9',
      title: 'Node.js Core Concepts',
      description: 'Event loop and streams',
      duration: 90,
      teacherId: '6',
      questions: [
        {
          id: '17',
          text: 'What is Node.js?',
          options: [
            'A JavaScript framework',
            'A JavaScript runtime environment',
            'A database system',
            'A web browser',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '18',
          text: 'What is npm?',
          options: [
            'Node Package Manager',
            'New Programming Method',
            'Network Protocol Manager',
            'Node Process Monitor',
          ],
          correctAnswer: 0,
          points: 10,
        },
      ],
    },

    // امتحانات Fatima Noor (Backend Engineer) - teacherId: '7'
    {
      id: '10',
      title: 'Database Systems',
      description: 'SQL queries and optimization',
      duration: 120,
      teacherId: '7',
      questions: [
        {
          id: '19',
          text: 'What does SQL stand for?',
          options: [
            'Structured Query Language',
            'Simple Query Language',
            'Standard Query Language',
            'System Query Language',
          ],
          correctAnswer: 0,
          points: 10,
        },
        {
          id: '20',
          text: 'Which command is used to retrieve data from database?',
          options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
          correctAnswer: 2,
          points: 12,
        },
      ],
    },

    // امتحانات Omar Adel (DevOps Specialist) - teacherId: '8'
    {
      id: '11',
      title: 'Cloud Infrastructure',
      description: 'AWS services deployment',
      duration: 90,
      teacherId: '8',
      questions: [
        {
          id: '21',
          text: 'What is AWS EC2?',
          options: [
            'A database service',
            'A compute service',
            'A storage service',
            'A networking service',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '22',
          text: 'What does CI/CD stand for?',
          options: [
            'Code Integration/Code Deployment',
            'Continuous Integration/Continuous Deployment',
            'Computer Integration/Computer Deployment',
            'Cloud Integration/Cloud Deployment',
          ],
          correctAnswer: 1,
          points: 12,
        },
      ],
    },

    // امتحانات Amira Saeed (Mobile Developer) - teacherId: '9'
    {
      id: '12',
      title: 'Mobile App Development',
      description: 'React Native components',
      duration: 120,
      teacherId: '9',
      questions: [
        {
          id: '23',
          text: 'What is React Native?',
          options: [
            'A web framework',
            'A mobile app development framework',
            'A database system',
            'A testing tool',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '24',
          text: 'Which component is used for text input in React Native?',
          options: ['Input', 'TextInput', 'TextField', 'InputText'],
          correctAnswer: 1,
          points: 10,
        },
      ],
    },

    // امتحانات Khaled Tarek (Python Instructor) - teacherId: '10'
    {
      id: '13',
      title: 'Python OOP',
      description: 'Classes and inheritance',
      duration: 90,
      teacherId: '10',
      questions: [
        {
          id: '25',
          text: 'What is a class in Python?',
          options: [
            'A function',
            'A blueprint for creating objects',
            'A variable',
            'A module',
          ],
          correctAnswer: 1,
          points: 12,
        },
        {
          id: '26',
          text: 'Which keyword is used for inheritance in Python?',
          options: ['extends', 'inherits', 'class', 'parentheses'],
          correctAnswer: 3,
          points: 10,
        },
      ],
    },

    // امتحانات Nada Mostafa (Java Developer) - teacherId: '11'
    {
      id: '14',
      title: 'Java Spring Framework',
      description: 'Dependency injection',
      duration: 120,
      teacherId: '11',
      questions: [
        {
          id: '27',
          text: 'What is Spring Framework?',
          options: [
            'A Java application framework',
            'A database system',
            'A web browser',
            'An operating system',
          ],
          correctAnswer: 0,
          points: 15,
        },
        {
          id: '28',
          text: 'What is dependency injection?',
          options: [
            'A design pattern for providing dependencies',
            'A type of database',
            'A web service',
            'A testing method',
          ],
          correctAnswer: 0,
          points: 12,
        },
      ],
    },

    // امتحانات Youssef Kamal (AI Engineer) - teacherId: '12'
    {
      id: '15',
      title: 'Machine Learning Basics',
      description: 'Supervised learning algorithms',
      duration: 150,
      teacherId: '12',
      questions: [
        {
          id: '29',
          text: 'What is supervised learning?',
          options: [
            'Learning with labeled data',
            'Learning without data',
            'Learning with unlabeled data',
            'Learning with partial data',
          ],
          correctAnswer: 0,
          points: 15,
        },
        {
          id: '30',
          text: 'Which is a classification algorithm?',
          options: ['Linear Regression', 'Decision Tree', 'K-Means', 'PCA'],
          correctAnswer: 1,
          points: 12,
        },
      ],
    },

    // امتحانات Reem Hossam (Cybersecurity Analyst) - teacherId: '13'
    {
      id: '16',
      title: 'Network Security',
      description: 'Encryption techniques',
      duration: 90,
      teacherId: '13',
      questions: [
        {
          id: '31',
          text: 'What is encryption?',
          options: [
            'Converting data into readable format',
            'Converting data into unreadable format',
            'Deleting data',
            'Copying data',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '32',
          text: 'What does HTTPS stand for?',
          options: [
            'HyperText Transfer Protocol Secure',
            'HyperText Transfer Protocol Simple',
            'HyperText Transfer Protocol System',
            'HyperText Transfer Protocol Standard',
          ],
          correctAnswer: 0,
          points: 10,
        },
      ],
    },

    // امتحانات Tamer Hassan (Cloud Architect) - teacherId: '14'
    {
      id: '17',
      title: 'Cloud Deployment',
      description: 'CI/CD pipelines',
      duration: 120,
      teacherId: '14',
      questions: [
        {
          id: '33',
          text: 'What is cloud computing?',
          options: [
            'Computing using local servers',
            'Computing using internet-based services',
            'Computing using mobile devices',
            'Computing using desktop applications',
          ],
          correctAnswer: 1,
          points: 15,
        },
        {
          id: '34',
          text: 'What is a pipeline in DevOps?',
          options: [
            'A water pipe',
            'An automated sequence of processes',
            'A type of database',
            'A programming language',
          ],
          correctAnswer: 1,
          points: 12,
        },
      ],
    },
  ];

  startExam(examId: string) {
    const exam = this.getExamDetails(examId);
    if (!exam) return;

    // بدء المؤقت
    const totalSeconds = exam.duration * 60;
    this.examTimer$.next(totalSeconds);

    timer(0, 1000).subscribe(() => {
      const remaining = this.examTimer$.value - 1;
      this.examTimer$.next(remaining);

      if (remaining <= 0) {
        this.submitExam(this.answers);
      }
    });

    this.currentExam$.next(exam);
  }

  submitExam(answers: number[]) {
    const exam = this.currentExam$.value;
    if (!exam) return null;

    this.answers = answers; // حفظ الإجابات

    let score = 0;
    answers.forEach((answerIdx, questionIdx) => {
      if (answerIdx === exam.questions[questionIdx].correctAnswer) {
        score += exam.questions[questionIdx].points;
      }
    });

    const totalScore = exam.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalScore) * 100);

    const result: ExamResult = {
      examId: exam.id,
      studentId: 'current-student-id',
      answers,
      score,
      totalScore,
      percentage,
      submittedAt: new Date(),
    };

    this.saveResult(result);
    return result;
  }
  endExam() {
    if (this.currentExam$.value) {
      this.submitExam(this.answers);
    }
    this.examEnded$.next(true);
  }

  private saveResult(result: ExamResult) {
    // In real app, send to API
    console.log('Exam result saved:', result);
    // Store in local storage for demo purposes
    localStorage.setItem(
      `exam-result-${result.examId}`,
      JSON.stringify(result)
    );
  }

  getCurrentExam() {
    return this.currentExam$.asObservable();
  }
  getExamDetails(examId: string): Exam | undefined {
    return this.exams.find((exam) => exam.id === examId);
  }
  getExamTimer() {
    return this.examTimer$.asObservable();
  }
}
