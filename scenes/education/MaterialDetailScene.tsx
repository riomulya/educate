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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.purple} />

      <LinearGradient
        colors={[colors.purple, colors.lightPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
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
              <View style={styles.materialTypeContainer}>
                <View style={styles.typeIconContainer}>
                  <Text style={styles.typeIconLarge}>{getTypeIcon(material.type)}</Text>
                </View>
                <Text style={styles.headerTitle}>{material.title}</Text>
                <Text style={styles.headerSubtitle}>Detail Materi</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.materialCard}>
          <View style={styles.materialHeader}>
            <View style={styles.badgeContainer}>
              <BlurView intensity={90} style={styles.difficultyBadgeContainer}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(material.difficulty) },
                  ]}>
                  <Ionicons name="trending-up" size={14} color={colors.white} />
                  <Text style={styles.difficultyText}>
                    {getDifficultyText(material.difficulty)}
                  </Text>
                </View>
              </BlurView>

              {material.isCompleted && (
                <BlurView intensity={90} style={styles.completedBadgeContainer}>
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                    <Text style={styles.completedText}>Selesai</Text>
                  </View>
                </BlurView>
              )}
            </View>
          </View>

          <View style={styles.materialInfo}>
            <Text style={styles.description}>{material.description}</Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <View style={styles.metaIconContainer}>
                <Ionicons name="time-outline" size={20} color={colors.purple} />
              </View>
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Durasi</Text>
                <Text style={styles.metaValue}>{material.duration} menit</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.metaIconContainer}>
                <Ionicons name="bar-chart-outline" size={20} color={colors.purple} />
              </View>
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>Tingkat</Text>
                <Text style={styles.metaValue}>{getDifficultyText(material.difficulty)}</Text>
              </View>
            </View>
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

      {!(material?.isCompleted || isCompleted) && (
        <BlurView intensity={95} style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleMarkCompleted}
            activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.purple, colors.lightPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeButtonGradient}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.white} />
              <Text style={styles.completeButtonText}>Tandai Selesai</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      )}
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
    paddingBottom: 30,
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
  materialTypeContainer: {
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIconLarge: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  materialCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  materialHeader: {
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyBadgeContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  difficultyText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadgeContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  completedText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  materialInfo: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  metaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(129, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metaTextContainer: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 16,
    color: colors.blackGray,
    fontWeight: '700',
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.purple,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
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
