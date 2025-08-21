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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, router } from 'expo-router';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Buku</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookHeader}>
          <View style={styles.coverContainer}>
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverIcon}>📚</Text>
            </View>
            {book.isDownloaded && (
              <View style={styles.downloadedBadge}>
                <Text style={styles.downloadedIcon}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>oleh {book.author}</Text>

            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>{renderStars(book.rating)}</View>
              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
            </View>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📄</Text>
                <Text style={styles.metaText}>{book.pages} halaman</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⬇️</Text>
                <Text style={styles.metaText}>
                  {formatDownloadCount(book.downloadCount)} unduhan
                </Text>
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

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.downloadButton, book.isDownloaded && styles.downloadedButton]}
          onPress={handleDownload}
          disabled={book.isDownloaded}>
          <Text style={styles.downloadButtonText}>
            {book.isDownloaded ? '✓ Sudah Diunduh' : '⬇️ Download Buku'}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  coverContainer: {
    position: 'relative',
    marginRight: 20,
  },
  coverPlaceholder: {
    width: 100,
    height: 140,
    borderRadius: 8,
    backgroundColor: colors.lightGrayPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverIcon: {
    fontSize: 40,
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
