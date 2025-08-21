import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Subject } from '@/types';
import { colors } from '@/theme/colors';
import SubjectCard from '@/components/elements/SubjectCard';
import SearchBar from '@/components/elements/SearchBar';
import Loading from '@/components/elements/Loading';
import {
  fetchSubjects,
  searchContent,
  setSearchQuery,
  clearSearchResults,
} from '@/slices/educationSlice';
import { signOut } from '@/slices/authSlice';
import { RootState, AppDispatch } from '@/utils/store';

export default function SubjectsScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { subjects, subjectsLoading, subjectsError, searchResults, searchLoading, searchQuery } =
    useSelector((state: RootState) => state.education);

  const { user } = useSelector((state: RootState) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSubjects());
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text));
    if (text.trim()) {
      dispatch(searchContent(text));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleClearSearch = () => {
    dispatch(clearSearchResults());
  };

  const handleSubjectPress = (subject: Subject) => {
    router.push(`/education/subject/${subject.id}`);
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(signOut()).unwrap();
            router.replace('/auth/sign-in');
          } catch (error) {
            Alert.alert('Error', 'Gagal keluar dari akun');
          }
        },
      },
    ]);
  };

  const renderSubjectCard = ({ item }: { item: Subject }) => (
    <SubjectCard subject={item} onPress={handleSubjectPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>Tidak ada mata pelajaran</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery ? 'Coba kata kunci yang berbeda' : 'Belum ada konten tersedia'}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
      <Text style={styles.errorDescription}>{subjectsError}</Text>
    </View>
  );

  const getDisplayData = () => {
    if (searchQuery.trim()) {
      return searchResults.subjects;
    }
    return subjects;
  };

  const isLoading = subjectsLoading || (searchQuery.trim() && searchLoading);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Pilih Mata Pelajaran</Text>
            <Text style={styles.subtitle}>
              Selamat datang, {user?.user_metadata?.full_name || user?.email}!
            </Text>
            <Text style={styles.description}>
              Mulai perjalanan belajar Anda dengan memilih mata pelajaran
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
        placeholder="Cari mata pelajaran..."
      />

      {isLoading ? (
        <Loading text="Memuat mata pelajaran..." />
      ) : subjectsError ? (
        renderError()
      ) : (
        <FlatList
          data={getDisplayData()}
          renderItem={renderSubjectCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.purple]}
              tintColor={colors.purple}
            />
          }
        />
      )}

      {searchQuery.trim() && (
        <View style={styles.searchStats}>
          <Text style={styles.searchStatsText}>
            {searchResults.subjects.length} mata pelajaran ditemukan
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.purple,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackGray,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  searchStats: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrayPurple,
  },
  searchStatsText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});
