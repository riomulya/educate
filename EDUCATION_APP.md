# Aplikasi Edukasi - React Native

Aplikasi edukasi lengkap yang dibangun dengan React Native, Expo SDK 53, TypeScript, dan Redux Toolkit. Aplikasi ini menyediakan platform pembelajaran interaktif dengan fitur mata pelajaran, materi, buku, dan quiz.

## 🚀 Fitur Utama

### 1. **Pilih Mata Pelajaran**

- Daftar mata pelajaran dengan kategori (Matematika, Bahasa Indonesia, Bahasa Inggris, IPA, Sejarah, Geografi)
- Indikator level kesulitan (Pemula, Menengah, Lanjutan)
- Informasi jumlah materi dan quiz untuk setiap mata pelajaran
- Fitur pencarian mata pelajaran
- Pull-to-refresh untuk memperbarui data

### 2. **Materi Pembelajaran**

- Berbagai tipe konten: Artikel, Video, dan Interaktif
- Indikator tingkat kesulitan (Mudah, Sedang, Sulit)
- Estimasi waktu belajar
- Sistem progress tracking (materi yang sudah diselesaikan)
- Konten lengkap dengan teks dan media pendukung
- Tombol "Tandai Selesai" untuk tracking progress

### 3. **Perpustakaan Buku**

- Koleksi buku digital dengan informasi lengkap
- Rating dan jumlah download
- Daftar chapter dengan ringkasan
- Fitur download buku (simulasi)
- Informasi penulis dan jumlah halaman

### 4. **Sistem Quiz Interaktif**

- Quiz dengan berbagai tipe pertanyaan:
  - Multiple choice (pilihan ganda)
  - True/False (benar/salah)
- Timer countdown untuk setiap quiz
- Sistem scoring dengan passing score
- Batas maksimal percobaan
- Progress bar dan navigasi pertanyaan
- Hasil quiz dengan statistik lengkap
- Feedback untuk jawaban yang benar/salah

### 5. **Navigasi dan UI/UX**

- Tab navigation untuk Materials, Books, dan Quizzes
- Design yang responsive dan user-friendly
- Loading states dan error handling
- Pull-to-refresh di berbagai screen
- Smooth navigation dengan Expo Router v5

## 🏗️ Arsitektur Aplikasi

### **Struktur Direktori**

```
app/
├── education/
│   ├── index.tsx              # Halaman utama daftar mata pelajaran
│   ├── subject/[id].tsx       # Detail mata pelajaran dengan tabs
│   ├── material/[id].tsx      # Detail materi pembelajaran
│   ├── book/[id].tsx          # Detail buku
│   └── quiz/[id].tsx          # Halaman quiz interaktif

components/elements/
├── SubjectCard/               # Kartu mata pelajaran
├── MaterialCard/              # Kartu materi
├── BookCard/                  # Kartu buku
└── QuizCard/                  # Kartu quiz

scenes/education/
├── SubjectsScene.tsx          # Scene daftar mata pelajaran
├── SubjectDetailScene.tsx     # Scene detail mata pelajaran
├── MaterialDetailScene.tsx    # Scene detail materi
├── BookDetailScene.tsx        # Scene detail buku
└── QuizScene.tsx              # Scene quiz interaktif

services/
└── educationService.ts        # Service untuk API dan data management

slices/
└── educationSlice.ts          # Redux slice untuk state management

types/
└── education.ts               # TypeScript interfaces
```

### **State Management**

Menggunakan **Redux Toolkit** dengan slice terstruktur:

- `subjects`: Daftar mata pelajaran
- `materials`: Materi pembelajaran
- `books`: Koleksi buku
- `quizzes`: Daftar quiz
- `searchResults`: Hasil pencarian
- `selectedItems`: Item yang dipilih untuk detail view
- `loading states`: Loading untuk setiap operasi

### **Data Flow**

1. **Service Layer**: `EducationService` mengelola semua operasi data
2. **Redux Actions**: Async thunks untuk operasi asinkron
3. **Components**: Menggunakan `useSelector` dan `useDispatch`
4. **Navigation**: Expo Router dengan dynamic routing

## 📱 Screens dan Navigasi

### 1. **Subjects Screen** (`/education`)

- Daftar semua mata pelajaran
- Search functionality
- Pull-to-refresh
- Navigation ke detail mata pelajaran

### 2. **Subject Detail Screen** (`/education/subject/[id]`)

- Header dengan warna sesuai mata pelajaran
- Tab navigation: Materials, Books, Quizzes
- Counter untuk setiap kategori konten

### 3. **Material Detail Screen** (`/education/material/[id]`)

- Konten materi lengkap
- Video player placeholder
- Progress tracking
- Tombol "Tandai Selesai"

### 4. **Book Detail Screen** (`/education/book/[id]`)

- Informasi buku lengkap
- Daftar chapter
- Fitur download
- Rating dan statistik

### 5. **Quiz Screen** (`/education/quiz/[id]`)

- Quiz preparation screen
- Timer countdown
- Question navigation
- Results screen dengan scoring

## 🎨 Design System

### **Colors**

```typescript
colors = {
  darkPurple: '#231d54',
  purple: '#8100ff',
  lightPurple: '#9388db',
  lightGrayPurple: '#f7f7fb',
  pink: '#ff3d69',
  gray: '#797777',
  blackGray: '#101212',
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
};
```

### **Component Patterns**

- **Cards**: Konsisten dengan shadow, border radius, dan padding
- **Badges**: Untuk level, difficulty, dan status
- **Icons**: Emoji untuk visual appeal
- **Typography**: Hierarchy yang jelas dengan font weights
- **Loading States**: Spinner dengan loading text
- **Empty States**: Friendly messages dengan icons

## 🔧 Teknologi yang Digunakan

- **React Native 0.79.5**
- **Expo SDK 53**
- **TypeScript** (strict mode)
- **Expo Router v5** (flat config)
- **Redux Toolkit** untuk state management
- **React Navigation** untuk navigasi
- **ESLint 9** dengan flat config

## 📊 Data Models

### **Subject**

```typescript
interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalMaterials: number;
  totalQuizzes: number;
}
```

### **Material**

```typescript
interface Material {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  isCompleted: boolean;
  // ... dan field lainnya
}
```

### **Quiz**

```typescript
interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  attempts: number;
  maxAttempts: number;
}
```

## 🚀 Cara Menjalankan

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Jalankan aplikasi**:

   ```bash
   npm run dev
   ```

3. **Platform specific**:
   ```bash
   npm run dev:ios     # iOS simulator
   npm run dev:android # Android emulator
   npm run dev:web     # Web browser
   ```

## 🔮 Fitur yang Bisa Dikembangkan

### **Immediate Improvements**

- [ ] Integrasi dengan API backend real
- [ ] Implementasi authentication dan user profiles
- [ ] Offline support dengan caching
- [ ] Push notifications untuk reminder belajar
- [ ] Dark mode support

### **Advanced Features**

- [ ] Video streaming untuk materi video
- [ ] PDF reader untuk buku digital
- [ ] Gamification dengan badges dan achievements
- [ ] Social features (diskusi, sharing progress)
- [ ] Analytics dan learning insights
- [ ] Multi-language support
- [ ] Accessibility improvements

### **Technical Enhancements**

- [ ] Unit dan integration testing
- [ ] Performance optimization
- [ ] Error boundary implementation
- [ ] Logging dan monitoring
- [ ] CI/CD pipeline setup

## 📝 Notes

- Aplikasi saat ini menggunakan mock data di `EducationService`
- Semua operasi async disimulasikan dengan `setTimeout`
- Design responsive untuk berbagai ukuran layar
- Mengikuti best practices React Native dan TypeScript
- State management yang scalable dengan Redux Toolkit
- Navigation yang SEO-friendly dengan Expo Router

---

**Aplikasi ini merupakan foundation yang solid untuk platform edukasi yang dapat dikembangkan lebih lanjut sesuai kebutuhan bisnis dan user requirements.**
