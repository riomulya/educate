import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '@/theme/colors';
import { Book } from '@/types';
import { EducationService } from '@/services/educationService';
import { RootState, AppDispatch } from '@/utils/store';

export default function BookDetailScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedBook } = useSelector((state: RootState) => state.education);

  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(selectedBook);

  useEffect(() => {
    if (id && !selectedBook) {
      loadBook();
    } else if (selectedBook) {
      setBook(selectedBook);
    }
  }, [id, selectedBook]);

  const loadBook = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const bookData = await EducationService.getBookById(id);
      setBook(bookData);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat buku');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!book) return;

    Alert.alert('Download Buku', `Apakah Anda ingin mengunduh "${book.title}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Download',
        onPress: () => {
          // Simulate download
          setBook({ ...book, isDownloaded: true });
          Alert.alert('Berhasil', 'Buku berhasil diunduh!');
        },
      },
    ]);
  };

  const handleChapterPress = (chapterIndex: number) => {
    Alert.alert(
      'Buka Chapter',
      `Membuka chapter ${chapterIndex + 1}: ${book?.chapters[chapterIndex]?.title}`,
      [{ text: 'OK' }],
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          ⭐
        </Text>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Text key="half" style={styles.star}>
          ⭐
        </Text>,
      );
    }

    return stars;
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Memuat buku...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📚</Text>
          <Text style={styles.errorTitle}>Buku tidak ditemukan</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.purple} />

      <LinearGradient
        colors={[colors.purple, '#6B46C1', colors.lightPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <BlurView intensity={20} style={styles.backButton}>
              <TouchableOpacity
                style={styles.backButtonInner}
                onPress={() => router.back()}
                activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
            </BlurView>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Detail Buku</Text>
              <Text style={styles.headerSubtitle}>Informasi lengkap buku</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookCard}>
          <View style={styles.bookHeader}>
            <View style={styles.coverContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.coverGradient}>
                <Text style={styles.coverIcon}>📚</Text>
                {book.isDownloaded && (
                  <BlurView intensity={90} style={styles.downloadedBadge}>
                    <View style={styles.downloadedBadgeInner}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                    </View>
                  </BlurView>
                )}
              </LinearGradient>
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>oleh {book.author}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>{renderStars(book.rating)}</View>
                <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="document-text-outline" size={20} color={colors.purple} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Halaman</Text>
                <Text style={styles.statValue}>{book.pages}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="download-outline" size={20} color={colors.purple} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Unduhan</Text>
                <Text style={styles.statValue}>{formatDownloadCount(book.downloadCount)}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star-outline" size={20} color={colors.purple} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Rating</Text>
                <Text style={styles.statValue}>{book.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        {book.chapters && book.chapters.length > 0 && (
          <View style={styles.chaptersContainer}>
            <Text style={styles.sectionTitle}>Daftar Isi</Text>
            {book.chapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterItem}
                onPress={() => handleChapterPress(index)}>
                <View style={styles.chapterHeader}>
                  <Text style={styles.chapterTitle}>
                    {index + 1}. {chapter.title}
                  </Text>
                  <Text style={styles.chapterPages}>
                    Hal. {chapter.pageStart}-{chapter.pageEnd}
                  </Text>
                </View>
                <Text style={styles.chapterSummary}>{chapter.summary}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <BlurView intensity={95} style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.downloadButton,
            (book.isDownloaded || isDownloaded) && styles.downloadedButton,
          ]}
          onPress={handleDownload}
          disabled={book.isDownloaded || isDownloaded}
          activeOpacity={0.8}>
          {book.isDownloaded || isDownloaded ? (
            <LinearGradient
              colors={['#4CAF50', '#45A049']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadButtonGradient}>
              <Ionicons name="checkmark-circle" size={24} color={colors.white} />
              <Text style={styles.downloadButtonText}>Sudah Diunduh</Text>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={[colors.purple, colors.lightPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadButtonGradient}>
              <Ionicons name="download-outline" size={24} color={colors.white} />
              <Text style={styles.downloadButtonText}>Download Buku</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  headerSpacer: {
    width: 40,
  },
  headerGradient: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    position: 'relative',
    alignItems: 'center',
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
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  bookCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  coverContainer: {
    marginRight: 20,
    position: 'relative',
  },
  coverGradient: {
    width: 100,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  coverIcon: {
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  downloadedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadedIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 8,
    lineHeight: 26,
  },
  author: {
    fontSize: 14,
    color: colors.gray,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.gray,
  },
  descriptionContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.blackGray,
    lineHeight: 24,
  },
  chaptersContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 16,
  },
  chapterItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrayPurple,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blackGray,
    flex: 1,
  },
  chapterPages: {
    fontSize: 12,
    color: colors.gray,
  },
  chapterSummary: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrayPurple,
  },
  downloadButton: {
    backgroundColor: colors.purple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadedButton: {
    backgroundColor: '#4CAF50',
  },
  downloadButtonText: {
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
