import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/theme/colors';
import { Quiz, Question, QuizAnswer } from '@/types';
import { EducationService } from '@/services/educationService';
import { submitQuizAnswers } from '@/slices/educationSlice';
import { useCompletionStatus } from '@/hooks/useCompletionStatus';
import { RootState, AppDispatch } from '@/utils/store';

export default function QuizScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedQuiz } = useSelector((state: RootState) => state.education);
  const { isQuizCompleted, markQuizCompleted, getQuizScore } = useCompletionStatus();

  const [quiz, setQuiz] = useState<Quiz | null>(selectedQuiz);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  useEffect(() => {
    if (id && !selectedQuiz) {
      loadQuiz();
    } else if (selectedQuiz) {
      setQuiz(selectedQuiz);
      setTimeRemaining(selectedQuiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [id, selectedQuiz]);

  useEffect(() => {
    if (quiz?.id) {
      const completed = isQuizCompleted(quiz.id);
      setIsAlreadyCompleted(completed);
      if (completed) {
        setPreviousScore(getQuizScore(quiz.id));
      }
    }
  }, [quiz?.id, isQuizCompleted, getQuizScore]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted, timeRemaining]);

  const loadQuiz = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const quizData = await EducationService.getQuizById(id);
      setQuiz(quizData);
      if (quizData) {
        setTimeRemaining(quizData.timeLimit * 60);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat quiz');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      timeSpent,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz(updatedAnswers);
    }
  };

  const handleTimeUp = () => {
    Alert.alert('Waktu Habis!', 'Waktu quiz telah habis. Quiz akan diselesaikan otomatis.', [
      { text: 'OK', onPress: () => finishQuiz(answers) },
    ]);
  };

  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    if (!quiz) return;

    setLoading(true);
    try {
      const result = await dispatch(
        submitQuizAnswers({
          quizId: quiz.id,
          answers: finalAnswers,
        }),
      ).unwrap();

      setQuizResult(result);
      setQuizCompleted(true);

      // Mark quiz as completed in AsyncStorage
      if (result?.score !== undefined) {
        await markQuizCompleted(quiz.id, result.score);
        console.log(`✅ Quiz ${quiz.id} completed with score: ${result.score}%`);
      }
    } catch (error) {
      console.error('Error finishing quiz:', error);
      Alert.alert('Error', 'Gagal menyimpan hasil quiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return colors.gray;
    }
  };

  const renderQuizResult = () => {
    if (!quizResult || !quiz) return null;

    const { score, passed, correctAnswers, totalQuestions } = quizResult;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultIcon}>{passed ? '🎉' : '😞'}</Text>
        <Text style={styles.resultTitle}>{passed ? 'Selamat!' : 'Belum Berhasil'}</Text>
        <Text style={styles.resultDescription}>
          {passed
            ? 'Anda telah lulus quiz ini!'
            : `Anda perlu skor minimal ${quiz.passingScore}% untuk lulus`}
        </Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Skor Anda</Text>
          <Text style={[styles.scoreValue, { color: passed ? '#4CAF50' : '#F44336' }]}>
            {score}%
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Benar</Text>
            <Text style={styles.statValue}>{correctAnswers}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{totalQuestions}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Salah</Text>
            <Text style={styles.statValue}>{totalQuestions - correctAnswers}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={() => router.back()}>
          <Text style={styles.finishButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuestion = () => {
    if (!quiz || quizCompleted) return null;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} dari {quiz.questions.length}
          </Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, selectedAnswer === index && styles.selectedOption]}
                onPress={() => handleAnswerSelect(index)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                  ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.type === 'true-false' && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, selectedAnswer === 0 && styles.selectedOption]}
              onPress={() => handleAnswerSelect(0)}>
              <Text style={[styles.optionText, selectedAnswer === 0 && styles.selectedOptionText]}>
                ✓ Benar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, selectedAnswer === 1 && styles.selectedOption]}
              onPress={() => handleAnswerSelect(1)}>
              <Text style={[styles.optionText, selectedAnswer === 1 && styles.selectedOptionText]}>
                ✗ Salah
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextButton, selectedAnswer === null && styles.disabledButton]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}>
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Memuat quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🧠</Text>
          <Text style={styles.errorTitle}>Quiz tidak ditemukan</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quiz.title}</Text>
        {quizStarted && !quizCompleted && (
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        )}
      </View>

      {!quizStarted ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDescription}>{quiz.description}</Text>

            {isAlreadyCompleted && previousScore !== null && (
              <View style={styles.completionCard}>
                <Text style={styles.completionIcon}>✅</Text>
                <Text style={styles.completionTitle}>Quiz Sudah Diselesaikan</Text>
                <Text style={styles.completionDescription}>
                  Anda sudah menyelesaikan quiz ini dengan skor {previousScore}%
                </Text>
                <View style={styles.completionScore}>
                  <Text
                    style={[
                      styles.completionScoreValue,
                      { color: previousScore >= quiz.passingScore ? '#4CAF50' : '#F44336' },
                    ]}>
                    {previousScore}%
                  </Text>
                  <Text style={styles.completionScoreLabel}>
                    {previousScore >= quiz.passingScore ? 'LULUS' : 'BELUM LULUS'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.quizMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>❓</Text>
                <Text style={styles.metaText}>{quiz.questions.length} pertanyaan</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaText}>{quiz.timeLimit} menit</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>🎯</Text>
                <Text style={styles.metaText}>Skor minimal {quiz.passingScore}%</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>🔄</Text>
                <Text style={styles.metaText}>
                  {quiz.attempts}/{quiz.maxAttempts} percobaan
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.difficultyContainer,
                { backgroundColor: getDifficultyColor(quiz.difficulty) },
              ]}>
              <Text style={styles.difficultyText}>
                Tingkat:{' '}
                {quiz.difficulty === 'easy'
                  ? 'Mudah'
                  : quiz.difficulty === 'medium'
                    ? 'Sedang'
                    : 'Sulit'}
              </Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <Text style={styles.startButtonText}>
                {isAlreadyCompleted ? 'Ulangi Quiz' : 'Mulai Quiz'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : quizCompleted ? (
        renderQuizResult()
      ) : (
        renderQuestion()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrayPurple,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGrayPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.blackGray,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blackGray,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.purple,
  },
  content: {
    flex: 1,
  },
  quizInfo: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  quizDescription: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  completionDescription: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  completionScore: {
    alignItems: 'center',
  },
  completionScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completionScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  quizMeta: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  metaText: {
    fontSize: 16,
    color: colors.blackGray,
  },
  difficultyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  difficultyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: colors.purple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGrayPurple,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.purple,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
    lineHeight: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.lightGrayPurple,
  },
  selectedOption: {
    borderColor: colors.purple,
    backgroundColor: colors.lightGrayPurple,
  },
  optionText: {
    fontSize: 16,
    color: colors.blackGray,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: colors.purple,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: colors.purple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
  },
  finishButton: {
    backgroundColor: colors.purple,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  finishButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.purple,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
