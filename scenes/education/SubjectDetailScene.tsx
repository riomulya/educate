import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { Material, Book, Quiz } from '@/types';
import { colors } from '@/theme/colors';
import MaterialCard from '@/components/elements/MaterialCard';
import BookCard from '@/components/elements/BookCard';
import QuizCard from '@/components/elements/QuizCard';
import {
  fetchSubjectById,
  fetchMaterialsBySubject,
  fetchBooksBySubject,
  fetchQuizzesBySubject,
  setActiveTab,
  setSelectedMaterial,
  setSelectedBook,
  setSelectedQuiz,
} from '@/slices/educationSlice';
import { RootState, AppDispatch } from '@/utils/store';

export default function SubjectDetailScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    selectedSubject,
    materials,
    books,
    quizzes,
    materialsLoading,
    booksLoading,
    quizzesLoading,
    activeTab,
  } = useSelector((state: RootState) => state.education);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubjectById(id));
      dispatch(fetchMaterialsBySubject(id));
      dispatch(fetchBooksBySubject(id));
      dispatch(fetchQuizzesBySubject(id));
    }
  }, [dispatch, id]);

  const handleTabPress = (tab: 'materials' | 'books' | 'quizzes') => {
    dispatch(setActiveTab(tab));
  };

  const handleMaterialPress = (material: Material) => {
    dispatch(setSelectedMaterial(material));
    router.push(`/education/material/${material.id}`);
  };

  const handleBookPress = (book: Book) => {
    dispatch(setSelectedBook(book));
    router.push(`/education/book/${book.id}`);
  };

  const handleQuizPress = (quiz: Quiz) => {
    dispatch(setSelectedQuiz(quiz));
    router.push(`/education/quiz/${quiz.id}`);
  };

  const renderMaterials = () => (
    <FlatList
      data={materials}
      renderItem={({ item }) => <MaterialCard material={item} onPress={handleMaterialPress} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>Belum ada materi tersedia</Text>
        </View>
      }
    />
  );

  const renderBooks = () => (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookCard book={item} onPress={handleBookPress} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>Belum ada buku tersedia</Text>
        </View>
      }
    />
  );

  const renderQuizzes = () => (
    <FlatList
      data={quizzes}
      renderItem={({ item }) => <QuizCard quiz={item} onPress={handleQuizPress} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧠</Text>
          <Text style={styles.emptyText}>Belum ada quiz tersedia</Text>
        </View>
      }
    />
  );

  const renderTabContent = () => {
    const isLoading = materialsLoading || booksLoading || quizzesLoading;

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Memuat konten...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'materials':
        return renderMaterials();
      case 'books':
        return renderBooks();
      case 'quizzes':
        return renderQuizzes();
      default:
        return renderMaterials();
    }
  };

  const getTabCount = (tab: 'materials' | 'books' | 'quizzes') => {
    switch (tab) {
      case 'materials':
        return materials.length;
      case 'books':
        return books.length;
      case 'quizzes':
        return quizzes.length;
      default:
        return 0;
    }
  };

  if (!selectedSubject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Memuat mata pelajaran...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: selectedSubject.color }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{selectedSubject.icon}</Text>
          <Text style={styles.headerTitle}>{selectedSubject.title}</Text>
          <Text style={styles.headerDescription}>{selectedSubject.description}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.activeTab]}
          onPress={() => handleTabPress('materials')}>
          <Text style={[styles.tabText, activeTab === 'materials' && styles.activeTabText]}>
            Materi ({getTabCount('materials')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'books' && styles.activeTab]}
          onPress={() => handleTabPress('books')}>
          <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>
            Buku ({getTabCount('books')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quizzes' && styles.activeTab]}
          onPress={() => handleTabPress('quizzes')}>
          <Text style={[styles.tabText, activeTab === 'quizzes' && styles.activeTabText]}>
            Quiz ({getTabCount('quizzes')})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.purple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.white,
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  tabContent: {
    paddingBottom: 20,
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
});
