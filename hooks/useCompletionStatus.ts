import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDataPersist, DataPersistKeys } from './useDataPersist';

interface CompletionData {
  materialCompletions: Record<string, boolean>;
  quizCompletions: Record<string, { completed: boolean; score: number; completedAt: string }>;
  bookDownloads: Record<string, boolean>;
}

interface UseCompletionStatusReturn {
  // Material completion
  isMaterialCompleted: (materialId: string) => boolean;
  markMaterialCompleted: (materialId: string) => Promise<void>;

  // Quiz completion
  isQuizCompleted: (quizId: string) => boolean;
  markQuizCompleted: (quizId: string, score: number) => Promise<void>;
  getQuizScore: (quizId: string) => number | null;

  // Book downloads
  isBookDownloaded: (bookId: string) => boolean;
  markBookDownloaded: (bookId: string) => Promise<void>;

  // General
  loading: boolean;
  clearAllCompletions: () => Promise<void>;
  getCompletionStats: () => { materialsCount: number; quizzesCount: number; booksCount: number };
}

const COMPLETION_STORAGE_KEY = 'EDUCATION_COMPLETIONS';

export const useCompletionStatus = (): UseCompletionStatusReturn => {
  const { setPersistData, getPersistData, removePersistData } = useDataPersist();
  const [completionData, setCompletionData] = useState<CompletionData>({
    materialCompletions: {},
    quizCompletions: {},
    bookDownloads: {},
  });
  const [loading, setLoading] = useState(true);

  // Load completion data on mount
  useEffect(() => {
    loadCompletionData();
  }, []);

  const loadCompletionData = async () => {
    try {
      setLoading(true);

      // Try to get from AsyncStorage first (legacy support)
      const legacyData = await AsyncStorage.getItem(COMPLETION_STORAGE_KEY);

      // Try to get from our persistent storage
      const persistentData = await getPersistData<CompletionData>(DataPersistKeys.USER_PREFERENCES);

      let finalData: CompletionData = {
        materialCompletions: {},
        quizCompletions: {},
        bookDownloads: {},
      };

      // Prioritize persistent data, fallback to legacy data
      if (persistentData) {
        finalData = persistentData;
      } else if (legacyData) {
        finalData = JSON.parse(legacyData);
        // Migrate to new storage
        await saveCompletionData(finalData);
        await AsyncStorage.removeItem(COMPLETION_STORAGE_KEY);
      }

      setCompletionData(finalData);
      console.log('✅ Completion data loaded:', finalData);
    } catch (error) {
      console.error('❌ Failed to load completion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCompletionData = async (data: CompletionData) => {
    try {
      await setPersistData(DataPersistKeys.USER_PREFERENCES, data);
      setCompletionData(data);
      console.log('✅ Completion data saved:', data);
    } catch (error) {
      console.error('❌ Failed to save completion data:', error);
    }
  };

  // Material completion methods
  const isMaterialCompleted = (materialId: string): boolean => {
    return completionData.materialCompletions[materialId] || false;
  };

  const markMaterialCompleted = async (materialId: string): Promise<void> => {
    const updatedData = {
      ...completionData,
      materialCompletions: {
        ...completionData.materialCompletions,
        [materialId]: true,
      },
    };
    await saveCompletionData(updatedData);
    console.log(`✅ Material ${materialId} marked as completed`);
  };

  // Quiz completion methods
  const isQuizCompleted = (quizId: string): boolean => {
    return completionData.quizCompletions[quizId]?.completed || false;
  };

  const markQuizCompleted = async (quizId: string, score: number): Promise<void> => {
    const updatedData = {
      ...completionData,
      quizCompletions: {
        ...completionData.quizCompletions,
        [quizId]: {
          completed: true,
          score,
          completedAt: new Date().toISOString(),
        },
      },
    };
    await saveCompletionData(updatedData);
    console.log(`✅ Quiz ${quizId} marked as completed with score: ${score}`);
  };

  const getQuizScore = (quizId: string): number | null => {
    return completionData.quizCompletions[quizId]?.score || null;
  };

  // Book download methods
  const isBookDownloaded = (bookId: string): boolean => {
    return completionData.bookDownloads[bookId] || false;
  };

  const markBookDownloaded = async (bookId: string): Promise<void> => {
    const updatedData = {
      ...completionData,
      bookDownloads: {
        ...completionData.bookDownloads,
        [bookId]: true,
      },
    };
    await saveCompletionData(updatedData);
    console.log(`✅ Book ${bookId} marked as downloaded`);
  };

  // Utility methods
  const clearAllCompletions = async (): Promise<void> => {
    const emptyData: CompletionData = {
      materialCompletions: {},
      quizCompletions: {},
      bookDownloads: {},
    };
    await saveCompletionData(emptyData);
    console.log('✅ All completion data cleared');
  };

  const getCompletionStats = () => {
    return {
      materialsCount: Object.keys(completionData.materialCompletions).filter(
        key => completionData.materialCompletions[key],
      ).length,
      quizzesCount: Object.keys(completionData.quizCompletions).filter(
        key => completionData.quizCompletions[key]?.completed,
      ).length,
      booksCount: Object.keys(completionData.bookDownloads).filter(
        key => completionData.bookDownloads[key],
      ).length,
    };
  };

  return {
    // Material completion
    isMaterialCompleted,
    markMaterialCompleted,

    // Quiz completion
    isQuizCompleted,
    markQuizCompleted,
    getQuizScore,

    // Book downloads
    isBookDownloaded,
    markBookDownloaded,

    // General
    loading,
    clearAllCompletions,
    getCompletionStats,
  };
};

export default useCompletionStatus;
