import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subject, Material, Book, Quiz, QuizAttempt } from '@/types';
import { EducationService } from '@/services/educationService';

interface EducationState {
  // Subjects
  subjects: Subject[];
  selectedSubject: Subject | null;
  subjectsLoading: boolean;
  subjectsError: string | null;

  // Materials
  materials: Material[];
  selectedMaterial: Material | null;
  materialsLoading: boolean;
  materialsError: string | null;

  // Books
  books: Book[];
  selectedBook: Book | null;
  booksLoading: boolean;
  booksError: string | null;

  // Quizzes
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  currentQuizAttempt: QuizAttempt | null;
  quizzesLoading: boolean;
  quizzesError: string | null;

  // Search
  searchResults: {
    subjects: Subject[];
    materials: Material[];
    books: Book[];
  };
  searchLoading: boolean;
  searchQuery: string;

  // UI State
  activeTab: 'materials' | 'books' | 'quizzes';
}

const initialState: EducationState = {
  subjects: [],
  selectedSubject: null,
  subjectsLoading: false,
  subjectsError: null,

  materials: [],
  selectedMaterial: null,
  materialsLoading: false,
  materialsError: null,

  books: [],
  selectedBook: null,
  booksLoading: false,
  booksError: null,

  quizzes: [],
  selectedQuiz: null,
  currentQuizAttempt: null,
  quizzesLoading: false,
  quizzesError: null,

  searchResults: {
    subjects: [],
    materials: [],
    books: [],
  },
  searchLoading: false,
  searchQuery: '',

  activeTab: 'materials',
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'education/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const subjects = await EducationService.getSubjects();
      return subjects;
    } catch (error) {
      return rejectWithValue('Failed to fetch subjects');
    }
  },
);

export const fetchSubjectById = createAsyncThunk(
  'education/fetchSubjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const subject = await EducationService.getSubjectById(id);
      return subject;
    } catch (error) {
      return rejectWithValue('Failed to fetch subject');
    }
  },
);

export const fetchMaterialsBySubject = createAsyncThunk(
  'education/fetchMaterialsBySubject',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const materials = await EducationService.getMaterialsBySubjectId(subjectId);
      return materials;
    } catch (error) {
      return rejectWithValue('Failed to fetch materials');
    }
  },
);

export const fetchBooksBySubject = createAsyncThunk(
  'education/fetchBooksBySubject',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const books = await EducationService.getBooksBySubjectId(subjectId);
      return books;
    } catch (error) {
      return rejectWithValue('Failed to fetch books');
    }
  },
);

export const fetchQuizzesBySubject = createAsyncThunk(
  'education/fetchQuizzesBySubject',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const quizzes = await EducationService.getQuizzesBySubjectId(subjectId);
      return quizzes;
    } catch (error) {
      return rejectWithValue('Failed to fetch quizzes');
    }
  },
);

export const submitQuizAnswers = createAsyncThunk(
  'education/submitQuizAnswers',
  async ({ quizId, answers }: { quizId: string; answers: any[] }, { rejectWithValue }) => {
    try {
      const result = await EducationService.submitQuizAnswers(quizId, answers);
      return result;
    } catch (error) {
      return rejectWithValue('Failed to submit quiz answers');
    }
  },
);

export const markMaterialCompleted = createAsyncThunk(
  'education/markMaterialCompleted',
  async (materialId: string, { rejectWithValue }) => {
    try {
      await EducationService.markMaterialCompleted(materialId);
      return materialId;
    } catch (error) {
      return rejectWithValue('Failed to mark material as completed');
    }
  },
);

export const searchContent = createAsyncThunk(
  'education/searchContent',
  async (query: string, { rejectWithValue }) => {
    try {
      const results = await EducationService.search(query);
      return results;
    } catch (error) {
      return rejectWithValue('Failed to search content');
    }
  },
);

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    setSelectedSubject: (state, action: PayloadAction<Subject | null>) => {
      state.selectedSubject = action.payload;
    },
    setSelectedMaterial: (state, action: PayloadAction<Material | null>) => {
      state.selectedMaterial = action.payload;
    },
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    setSelectedQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.selectedQuiz = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'materials' | 'books' | 'quizzes'>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: state => {
      state.searchResults = {
        subjects: [],
        materials: [],
        books: [],
      };
      state.searchQuery = '';
    },
    startQuizAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      state.currentQuizAttempt = action.payload;
    },
    clearQuizAttempt: state => {
      state.currentQuizAttempt = null;
    },
  },
  extraReducers: builder => {
    // Fetch subjects
    builder
      .addCase(fetchSubjects.pending, state => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload as string;
      });

    // Fetch subject by ID
    builder.addCase(fetchSubjectById.fulfilled, (state, action) => {
      if (action.payload) {
        state.selectedSubject = action.payload;
      }
    });

    // Fetch materials
    builder
      .addCase(fetchMaterialsBySubject.pending, state => {
        state.materialsLoading = true;
        state.materialsError = null;
      })
      .addCase(fetchMaterialsBySubject.fulfilled, (state, action) => {
        state.materialsLoading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterialsBySubject.rejected, (state, action) => {
        state.materialsLoading = false;
        state.materialsError = action.payload as string;
      });

    // Fetch books
    builder
      .addCase(fetchBooksBySubject.pending, state => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(fetchBooksBySubject.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksBySubject.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.payload as string;
      });

    // Fetch quizzes
    builder
      .addCase(fetchQuizzesBySubject.pending, state => {
        state.quizzesLoading = true;
        state.quizzesError = null;
      })
      .addCase(fetchQuizzesBySubject.fulfilled, (state, action) => {
        state.quizzesLoading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesBySubject.rejected, (state, action) => {
        state.quizzesLoading = false;
        state.quizzesError = action.payload as string;
      });

    // Mark material completed
    builder.addCase(markMaterialCompleted.fulfilled, (state, action) => {
      const materialId = action.payload;
      const material = state.materials.find(m => m.id === materialId);
      if (material) {
        material.isCompleted = true;
      }
    });

    // Search content
    builder
      .addCase(searchContent.pending, state => {
        state.searchLoading = true;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, state => {
        state.searchLoading = false;
      });
  },
});

export const {
  setSelectedSubject,
  setSelectedMaterial,
  setSelectedBook,
  setSelectedQuiz,
  setActiveTab,
  setSearchQuery,
  clearSearchResults,
  startQuizAttempt,
  clearQuizAttempt,
} = educationSlice.actions;

export default educationSlice.reducer;
