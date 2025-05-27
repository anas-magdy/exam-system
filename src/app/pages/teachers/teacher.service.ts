import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // هذا يجعل الخدمة متاحة على مستوى التطبيق بالكامل
})
export class TeacherService {
  private allTeachers = [
    {
      id: '1',
      name: 'Bonnie Green',
      title: 'Angular Developer',
      imageUrl: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    },
    {
      id: '2',
      name: 'Ahmed Ali',
      title: 'React Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      id: '3',
      name: 'Layla Hassan',
      title: 'Vue.js Expert',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: '4',
      name: 'Mohamed Zidan',
      title: 'Full Stack Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '5',
      name: 'Sara Ibrahim',
      title: 'UI/UX Designer',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '6',
      name: 'John Carter',
      title: 'Node.js Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      id: '7',
      name: 'Fatima Noor',
      title: 'Backend Engineer',
      imageUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    },
    {
      id: '8',
      name: 'Omar Adel',
      title: 'DevOps Specialist',
      imageUrl: 'https://randomuser.me/api/portraits/men/81.jpg',
    },
    {
      id: '9',
      name: 'Amira Saeed',
      title: 'Mobile Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/19.jpg',
    },
    {
      id: '10',
      name: 'Khaled Tarek',
      title: 'Python Instructor',
      imageUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      id: '11',
      name: 'Nada Mostafa',
      title: 'Java Developer',
      imageUrl: 'https://randomuser.me/api/portraits/women/37.jpg',
    },
    {
      id: '12',
      name: 'Youssef Kamal',
      title: 'AI Engineer',
      imageUrl: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
      id: '13',
      name: 'Reem Hossam',
      title: 'Cybersecurity Analyst',
      imageUrl: 'https://randomuser.me/api/portraits/women/49.jpg',
    },
    {
      id: '14',
      name: 'Tamer Hassan',
      title: 'Cloud Architect',
      imageUrl: 'https://randomuser.me/api/portraits/men/28.jpg',
    },
  ];

  private examsData = [
    {
      teacherId: '1',
      exams: [
        {
          id: '1',
          title: 'Midterm Exam',
          date: '2023-11-15',
          duration: '90 minutes',
          description: 'Covers chapters 1-5',
        },
        {
          id: '2',
          title: 'Final Exam',
          date: '2023-12-20',
          duration: '120 minutes',
          description: 'Comprehensive exam',
        },
      ],
    },
    // يمكنك إضافة بيانات الامتحانات لباقي المدرسين هنا
  ];

  constructor() {}

  // الحصول على جميع المدرسين
  getAllTeachers() {
    return this.allTeachers;
  }

  // الحصول على مدرس بواسطة الـ ID
  getTeacherById(id: string) {
    return this.allTeachers.find((teacher) => teacher.id === id);
  }

  // الحصول على امتحانات مدرس معين
  getTeacherExams(teacherId: string) {
    const teacherExams = this.examsData.find(
      (item) => item.teacherId === teacherId
    );
    return teacherExams ? teacherExams.exams : [];
  }

  // الحصول على عناوين المدرسين (للتصفية)
  getTeacherTitles() {
    return [...new Set(this.allTeachers.map((teacher) => teacher.title))];
  }

  // البحث عن مدرسين
  searchTeachers(query: string, titleFilter: string = '') {
    return this.allTeachers.filter((teacher) => {
      const matchesSearch = teacher.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTitle = !titleFilter || teacher.title === titleFilter;
      return matchesSearch && matchesTitle;
    });
  }
}
