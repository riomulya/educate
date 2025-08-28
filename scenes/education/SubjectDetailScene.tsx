import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  StatusBar,
} from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
    <AnimatePresence>
      <FlatList
        data={materials}
        renderItem={({ item, index }) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateY: 30, scale: 0.9 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{
              type: 'spring',
              delay: index * 100,
              damping: 15,
              stiffness: 150,
            }}>
            <MaterialCard material={item} onPress={handleMaterialPress} />
          </MotiView>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            style={styles.emptyContainer}>
            <MotiText
              from={{ opacity: 0, rotate: '-10deg' }}
              animate={{ opacity: 1, rotate: '0deg' }}
              transition={{ type: 'spring', delay: 200 }}
              style={styles.emptyIcon}>
              📖
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 400 }}
              style={styles.emptyText}>
              Belum ada materi tersedia
            </MotiText>
          </MotiView>
        }
      />
    </AnimatePresence>
  );

  const renderBooks = () => (
    <AnimatePresence>
      <FlatList
        data={books}
        renderItem={({ item, index }) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: -30, scale: 0.9 }}
            animate={{ opacity: 1, translateX: 0, scale: 1 }}
            transition={{
              type: 'spring',
              delay: index * 120,
              damping: 15,
              stiffness: 150,
            }}>
            <BookCard book={item} onPress={handleBookPress} />
          </MotiView>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            style={styles.emptyContainer}>
            <MotiText
              from={{ opacity: 0, rotate: '10deg' }}
              animate={{ opacity: 1, rotate: '0deg' }}
              transition={{ type: 'spring', delay: 200 }}
              style={styles.emptyIcon}>
              📚
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 400 }}
              style={styles.emptyText}>
              Belum ada buku tersedia
            </MotiText>
          </MotiView>
        }
      />
    </AnimatePresence>
  );

  const renderQuizzes = () => (
    <AnimatePresence>
      <FlatList
        data={quizzes}
        renderItem={({ item, index }) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: 30, scale: 0.9 }}
            animate={{ opacity: 1, translateX: 0, scale: 1 }}
            transition={{
              type: 'spring',
              delay: index * 80,
              damping: 15,
              stiffness: 150,
            }}>
            <QuizCard quiz={item} onPress={handleQuizPress} />
          </MotiView>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            style={styles.emptyContainer}>
            <MotiText
              from={{ opacity: 0, rotate: '-5deg' }}
              animate={{ opacity: 1, rotate: '0deg' }}
              transition={{ type: 'spring', delay: 200 }}
              style={styles.emptyIcon}>
              🧠
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 400 }}
              style={styles.emptyText}>
              Belum ada quiz tersedia
            </MotiText>
          </MotiView>
        }
      />
    </AnimatePresence>
  );

  const renderTabContent = () => {
    const isLoading = materialsLoading || booksLoading || quizzesLoading;

    if (isLoading) {
      return (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 200 }}
            style={styles.loadingText}>
            Memuat konten...
          </MotiText>
        </MotiView>
      );
    }

    return (
      <AnimatePresence>
        <MotiView
          key={activeTab}
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 }}
          transition={{ type: 'timing', duration: 300 }}
          style={{ flex: 1 }}>
          {(() => {
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
          })()}
        </MotiView>
      </AnimatePresence>
    );
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={selectedSubject.color} />

      <MotiView
        from={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 800 }}>
        <LinearGradient
          colors={[selectedSubject.color, selectedSubject.color + '80', colors.lightGrayPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.headerContainer}>
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 300 }}>
                <BlurView intensity={20} style={styles.backButton}>
                  <TouchableOpacity
                    style={styles.backButtonInner}
                    onPress={() => router.back()}
                    activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                  </TouchableOpacity>
                </BlurView>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 200 }}
                style={styles.headerContent}>
                <MotiView
                  from={{ opacity: 0, scale: 0, rotate: '45deg' }}
                  animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
                  transition={{ type: 'spring', delay: 400 }}
                  style={styles.iconContainer}>
                  <Text style={styles.headerIcon}>{selectedSubject.icon}</Text>
                </MotiView>
                <MotiText
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 600, delay: 600 }}
                  style={styles.headerTitle}>
                  {selectedSubject.title}
                </MotiText>
                <MotiText
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 600, delay: 800 }}
                  style={styles.headerDescription}>
                  {selectedSubject.description}
                </MotiText>
              </MotiView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 1000 }}
        style={styles.tabContainer}>
        <BlurView intensity={90} style={styles.tabBlurView}>
          <View style={styles.tabWrapper}>
            <MotiView
              animate={{
                scale: activeTab === 'materials' ? 1.05 : 1,
                backgroundColor: activeTab === 'materials' ? colors.purple : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={styles.tab}>
              <TouchableOpacity
                style={styles.tabContent}
                onPress={() => handleTabPress('materials')}
                activeOpacity={0.8}>
                <Ionicons
                  name={activeTab === 'materials' ? 'document-text' : 'document-text-outline'}
                  size={20}
                  color={activeTab === 'materials' ? colors.white : colors.gray}
                />
                <Text style={[styles.tabText, activeTab === 'materials' && styles.activeTabText]}>
                  Materi
                </Text>
                <MotiView
                  animate={{
                    scale: activeTab === 'materials' ? 1.1 : 1,
                    backgroundColor:
                      activeTab === 'materials' ? 'rgba(255,255,255,0.3)' : colors.lightGrayPurple,
                  }}
                  transition={{ type: 'spring' }}
                  style={styles.badge}>
                  <Text
                    style={[
                      styles.badgeText,
                      { color: activeTab === 'materials' ? colors.white : colors.gray },
                    ]}>
                    {getTabCount('materials')}
                  </Text>
                </MotiView>
              </TouchableOpacity>
            </MotiView>

            <MotiView
              animate={{
                scale: activeTab === 'books' ? 1.05 : 1,
                backgroundColor: activeTab === 'books' ? colors.purple : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={styles.tab}>
              <TouchableOpacity
                style={styles.tabContent}
                onPress={() => handleTabPress('books')}
                activeOpacity={0.8}>
                <Ionicons
                  name={activeTab === 'books' ? 'book' : 'book-outline'}
                  size={20}
                  color={activeTab === 'books' ? colors.white : colors.gray}
                />
                <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>
                  Buku
                </Text>
                <MotiView
                  animate={{
                    scale: activeTab === 'books' ? 1.1 : 1,
                    backgroundColor:
                      activeTab === 'books' ? 'rgba(255,255,255,0.3)' : colors.lightGrayPurple,
                  }}
                  transition={{ type: 'spring' }}
                  style={styles.badge}>
                  <Text
                    style={[
                      styles.badgeText,
                      { color: activeTab === 'books' ? colors.white : colors.gray },
                    ]}>
                    {getTabCount('books')}
                  </Text>
                </MotiView>
              </TouchableOpacity>
            </MotiView>

            <MotiView
              animate={{
                scale: activeTab === 'quizzes' ? 1.05 : 1,
                backgroundColor: activeTab === 'quizzes' ? colors.purple : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={styles.tab}>
              <TouchableOpacity
                style={styles.tabContent}
                onPress={() => handleTabPress('quizzes')}
                activeOpacity={0.8}>
                <Ionicons
                  name={activeTab === 'quizzes' ? 'help-circle' : 'help-circle-outline'}
                  size={20}
                  color={activeTab === 'quizzes' ? colors.white : colors.gray}
                />
                <Text style={[styles.tabText, activeTab === 'quizzes' && styles.activeTabText]}>
                  Quiz
                </Text>
                <MotiView
                  animate={{
                    scale: activeTab === 'quizzes' ? 1.1 : 1,
                    backgroundColor:
                      activeTab === 'quizzes' ? 'rgba(255,255,255,0.3)' : colors.lightGrayPurple,
                  }}
                  transition={{ type: 'spring' }}
                  style={styles.badge}>
                  <Text
                    style={[
                      styles.badgeText,
                      { color: activeTab === 'quizzes' ? colors.white : colors.gray },
                    ]}>
                    {getTabCount('quizzes')}
                  </Text>
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          </View>
        </BlurView>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 1200 }}
        style={styles.content}>
        {renderTabContent()}
      </MotiView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  headerGradient: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    zIndex: 10,
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: screenWidth * 0.8,
  },
  tabContainer: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tabBlurView: {
    borderRadius: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    padding: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.purple,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.white,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  tabContent: {
    paddingTop: 8,
    paddingBottom: 100,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 20,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
  tabContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 6,
  },
});
