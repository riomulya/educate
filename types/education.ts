export interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    totalMaterials: number;
    totalQuizzes: number;
}

export interface Material {
    id: string;
    subjectId: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'interactive';
    duration: number; // in minutes
    difficulty: 'easy' | 'medium' | 'hard';
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    isCompleted: boolean;
    order: number;
}

export interface Book {
    id: string;
    subjectId: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    pdfUrl?: string;
    pages: number;
    rating: number;
    downloadCount: number;
    isDownloaded: boolean;
    chapters: BookChapter[];
}

export interface BookChapter {
    id: string;
    title: string;
    pageStart: number;
    pageEnd: number;
    summary: string;
}

export interface Quiz {
    id: string;
    subjectId: string;
    materialId?: string;
    title: string;
    description: string;
    questions: Question[];
    timeLimit: number; // in minutes
    passingScore: number; // percentage
    difficulty: 'easy' | 'medium' | 'hard';
    attempts: number;
    maxAttempts: number;
}

export interface Question {
    id: string;
    text: string;
    type: 'multiple-choice' | 'true-false' | 'essay';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    answers: QuizAnswer[];
    score: number;
    passed: boolean;
    timeSpent: number; // in seconds
}

export interface QuizAnswer {
    questionId: string;
    answer: string | number;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}

export interface UserProgress {
    userId: string;
    subjectId: string;
    completedMaterials: string[];
    completedQuizzes: string[];
    totalScore: number;
    progressPercentage: number;
    lastAccessDate: Date;
    certificates: Certificate[];
}

export interface Certificate {
    id: string;
    subjectId: string;
    userId: string;
    title: string;
    issuedDate: Date;
    score: number;
    certificateUrl: string;
} 