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
import { EducationService } from '@/services/educationService';
import { markMaterialCompleted } from '@/slices/educationSlice';
import { RootState, AppDispatch } from '@/utils/store';

export default function MaterialDetailScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedMaterial } = useSelector((state: RootState) => state.education);

  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState(selectedMaterial);

  useEffect(() => {
    if (id && !selectedMaterial) {
      loadMaterial();
    } else if (selectedMaterial) {
      setMaterial(selectedMaterial);
    }
  }, [id, selectedMaterial]);

  const loadMaterial = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const materialData = await EducationService.getMaterialById(id);
      setMaterial(materialData);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat materi');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!material) return;

    try {
      await dispatch(markMaterialCompleted(material.id));
      setMaterial({ ...material, isCompleted: true });
      Alert.alert('Selamat!', 'Materi telah ditandai sebagai selesai', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menandai materi sebagai selesai');
    }
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

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Mudah';
      case 'medium':
        return 'Sedang';
      case 'hard':
        return 'Sulit';
      default:
        return difficulty;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📖';
      case 'interactive':
        return '🎮';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.purple} />
          <Text style={styles.loadingText}>Memuat materi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!material) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📖</Text>
          <Text style={styles.errorTitle}>Materi tidak ditemukan</Text>
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
        <Text style={styles.headerTitle}>Detail Materi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.materialHeader}>
          <View style={styles.typeContainer}>
            <Text style={styles.typeIcon}>{getTypeIcon(material.type)}</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(material.difficulty) },
              ]}>
              <Text style={styles.difficultyText}>{getDifficultyText(material.difficulty)}</Text>
            </View>
          </View>

          {material.isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedIcon}>✓</Text>
              <Text style={styles.completedText}>Selesai</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{material.title}</Text>
        <Text style={styles.description}>{material.description}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>Durasi: {material.duration} menit</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📊</Text>
            <Text style={styles.metaText}>Tingkat: {getDifficultyText(material.difficulty)}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Konten Materi</Text>
          <Text style={styles.contentText}>{material.content}</Text>

          {material.type === 'video' && material.videoUrl && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoPlaceholder}>🎥 Video Pembelajaran</Text>
              <Text style={styles.videoNote}>
                Video akan diputar di sini. URL: {material.videoUrl}
              </Text>
            </View>
          )}

          {material.imageUrl && (
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>🖼️ Gambar Pendukung</Text>
              <Text style={styles.imageNote}>
                Gambar akan ditampilkan di sini. URL: {material.imageUrl}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!material.isCompleted && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.completeButton} onPress={handleMarkCompleted}>
            <Text style={styles.completeButtonText}>Tandai Selesai</Text>
          </TouchableOpacity>
        </View>
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
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  completedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blackGray,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.gray,
  },
  contentContainer: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: colors.blackGray,
    lineHeight: 24,
    marginBottom: 20,
  },
  videoContainer: {
    backgroundColor: colors.lightGrayPurple,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 18,
    marginBottom: 8,
  },
  videoNote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: colors.lightGrayPurple,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 18,
    marginBottom: 8,
  },
  imageNote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrayPurple,
  },
  completeButton: {
    backgroundColor: colors.purple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
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
