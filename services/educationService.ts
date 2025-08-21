import { Subject, Material, Book, Quiz, Question, UserProgress } from '@/types';

// Mock data untuk subjects
const mockSubjects: Subject[] = [
  {
    id: '1',
    title: 'Matematika',
    description: 'Pelajari konsep matematika dari dasar hingga lanjutan',
    icon: '📐',
    color: '#4CAF50',
    level: 'beginner',
    totalMaterials: 15,
    totalQuizzes: 8,
  },
  {
    id: '2',
    title: 'Bahasa Indonesia',
    description: 'Kuasai tata bahasa dan sastra Indonesia',
    icon: '📚',
    color: '#2196F3',
    level: 'intermediate',
    totalMaterials: 12,
    totalQuizzes: 6,
  },
  {
    id: '3',
    title: 'Bahasa Inggris',
    description: 'Tingkatkan kemampuan bahasa Inggris Anda',
    icon: '🗣️',
    color: '#FF9800',
    level: 'intermediate',
    totalMaterials: 20,
    totalQuizzes: 10,
  },
  {
    id: '4',
    title: 'IPA (Sains)',
    description: 'Jelajahi dunia sains dan fenomena alam',
    icon: '🔬',
    color: '#9C27B0',
    level: 'intermediate',
    totalMaterials: 18,
    totalQuizzes: 9,
  },
  {
    id: '5',
    title: 'Sejarah',
    description: 'Pelajari peristiwa bersejarah Indonesia dan dunia',
    icon: '🏛️',
    color: '#795548',
    level: 'beginner',
    totalMaterials: 14,
    totalQuizzes: 7,
  },
  {
    id: '6',
    title: 'Geografi',
    description: 'Kenali bumi dan fenomena geografis',
    icon: '🌍',
    color: '#607D8B',
    level: 'beginner',
    totalMaterials: 16,
    totalQuizzes: 8,
  },
];

// Mock data untuk materials
const mockMaterials: Material[] = [
  {
    id: '1',
    subjectId: '1',
    title: 'Pengenalan Bilangan',
    description: 'Memahami konsep dasar bilangan dan operasi matematika',
    type: 'article',
    duration: 30,
    difficulty: 'easy',
    content:
      'Bilangan adalah konsep dasar dalam matematika yang digunakan untuk menghitung, mengukur, dan melabel...',
    imageUrl: 'https://via.placeholder.com/300x200',
    isCompleted: false,
    order: 1,
  },
  {
    id: '2',
    subjectId: '1',
    title: 'Operasi Penjumlahan dan Pengurangan',
    description: 'Belajar cara melakukan penjumlahan dan pengurangan',
    type: 'video',
    duration: 45,
    difficulty: 'easy',
    content: 'Video pembelajaran tentang operasi dasar matematika',
    videoUrl: 'https://example.com/video1',
    isCompleted: false,
    order: 2,
  },
  {
    id: '3',
    subjectId: '2',
    title: 'Tata Bahasa Indonesia',
    description: 'Memahami struktur kalimat dalam bahasa Indonesia',
    type: 'article',
    duration: 40,
    difficulty: 'medium',
    content: 'Tata bahasa Indonesia mencakup aturan-aturan dalam pembentukan kata dan kalimat...',
    imageUrl: 'https://via.placeholder.com/300x200',
    isCompleted: false,
    order: 1,
  },
];

// Mock data untuk books
const mockBooks: Book[] = [
  {
    id: '1',
    subjectId: '1',
    title: 'Matematika Dasar untuk Pemula',
    author: 'Dr. Ahmad Susanto',
    description: 'Buku panduan lengkap matematika dasar dengan penjelasan yang mudah dipahami',
    coverUrl: 'https://via.placeholder.com/200x300',
    pages: 250,
    rating: 4.5,
    downloadCount: 1250,
    isDownloaded: false,
    chapters: [
      {
        id: '1',
        title: 'Pengenalan Bilangan',
        pageStart: 1,
        pageEnd: 25,
        summary: 'Konsep dasar bilangan dan jenis-jenisnya',
      },
      {
        id: '2',
        title: 'Operasi Dasar',
        pageStart: 26,
        pageEnd: 60,
        summary: 'Penjumlahan, pengurangan, perkalian, dan pembagian',
      },
    ],
  },
  {
    id: '2',
    subjectId: '2',
    title: 'Panduan Lengkap Bahasa Indonesia',
    author: 'Prof. Siti Nurhaliza',
    description: 'Buku komprehensif tentang tata bahasa dan sastra Indonesia',
    coverUrl: 'https://via.placeholder.com/200x300',
    pages: 320,
    rating: 4.7,
    downloadCount: 890,
    isDownloaded: false,
    chapters: [
      {
        id: '1',
        title: 'Tata Bahasa',
        pageStart: 1,
        pageEnd: 80,
        summary: 'Aturan dan struktur bahasa Indonesia',
      },
    ],
  },
];

// Mock data untuk quizzes
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    subjectId: '1',
    materialId: '1',
    title: 'Quiz Pengenalan Bilangan',
    description: 'Uji pemahaman Anda tentang konsep bilangan',
    timeLimit: 15,
    passingScore: 70,
    difficulty: 'easy',
    attempts: 0,
    maxAttempts: 3,
    questions: [
      {
        id: '1',
        text: 'Berapakah hasil dari 5 + 3?',
        type: 'multiple-choice',
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
        explanation: '5 + 3 = 8',
        points: 10,
      },
      {
        id: '2',
        text: 'Bilangan prima adalah bilangan yang hanya habis dibagi oleh 1 dan dirinya sendiri',
        type: 'true-false',
        correctAnswer: 0,
        explanation:
          'Pernyataan ini benar. Bilangan prima hanya memiliki dua faktor: 1 dan dirinya sendiri.',
        points: 10,
      },
    ],
  },
  {
    id: '2',
    subjectId: '2',
    title: 'Quiz Tata Bahasa Indonesia',
    description: 'Tes kemampuan tata bahasa Indonesia Anda',
    timeLimit: 20,
    passingScore: 75,
    difficulty: 'medium',
    attempts: 0,
    maxAttempts: 3,
    questions: [
      {
        id: '1',
        text: 'Apa yang dimaksud dengan subjek dalam kalimat?',
        type: 'multiple-choice',
        options: [
          'Pelaku dalam kalimat',
          'Tindakan dalam kalimat',
          'Objek dalam kalimat',
          'Keterangan dalam kalimat',
        ],
        correctAnswer: 0,
        explanation: 'Subjek adalah pelaku atau yang melakukan tindakan dalam kalimat',
        points: 15,
      },
    ],
  },
];

export class EducationService {
  // Get all subjects
  static async getSubjects(): Promise<Subject[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSubjects;
  }

  // Get subject by ID
  static async getSubjectById(id: string): Promise<Subject | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSubjects.find(subject => subject.id === id) || null;
  }

  // Get materials by subject ID
  static async getMaterialsBySubjectId(subjectId: string): Promise<Material[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockMaterials.filter(material => material.subjectId === subjectId);
  }

  // Get material by ID
  static async getMaterialById(id: string): Promise<Material | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMaterials.find(material => material.id === id) || null;
  }

  // Get books by subject ID
  static async getBooksBySubjectId(subjectId: string): Promise<Book[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBooks.filter(book => book.subjectId === subjectId);
  }

  // Get book by ID
  static async getBookById(id: string): Promise<Book | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBooks.find(book => book.id === id) || null;
  }

  // Get quizzes by subject ID
  static async getQuizzesBySubjectId(subjectId: string): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockQuizzes.filter(quiz => quiz.subjectId === subjectId);
  }

  // Get quiz by ID
  static async getQuizById(id: string): Promise<Quiz | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockQuizzes.find(quiz => quiz.id === id) || null;
  }

  // Submit quiz answers
  static async submitQuizAnswers(
    quizId: string,
    answers: any[],
  ): Promise<{
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (quiz.questions[index] && answer.answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return {
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
    };
  }

  // Mark material as completed
  static async markMaterialCompleted(materialId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const material = mockMaterials.find(m => m.id === materialId);
    if (material) {
      material.isCompleted = true;
    }
  }

  // Search subjects, materials, and books
  static async search(query: string): Promise<{
    subjects: Subject[];
    materials: Material[];
    books: Book[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const lowercaseQuery = query.toLowerCase();

    const subjects = mockSubjects.filter(
      subject =>
        subject.title.toLowerCase().includes(lowercaseQuery) ||
        subject.description.toLowerCase().includes(lowercaseQuery),
    );

    const materials = mockMaterials.filter(
      material =>
        material.title.toLowerCase().includes(lowercaseQuery) ||
        material.description.toLowerCase().includes(lowercaseQuery),
    );

    const books = mockBooks.filter(
      book =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.description.toLowerCase().includes(lowercaseQuery),
    );

    return { subjects, materials, books };
  }
}
