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
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
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

const { width: screenWidth } = Dimensions.get('window');

export default function SubjectsScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { subjects, subjectsLoading, subjectsError, searchResults, searchLoading, searchQuery } =
    useSelector((state: RootState) => state.education);

  const { user } = useSelector((state: RootState) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const searchOpacity = useSharedValue(1);
  const listOpacity = useSharedValue(0);

  useEffect(() => {
    dispatch(fetchSubjects());
    // Animate list entrance
    listOpacity.value = withTiming(1, { duration: 800 });
  }, [dispatch, listOpacity]);

  // Handle scroll for header hide/show
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const previousScrollY = scrollY.value;

    scrollY.value = currentScrollY;

    // Hide header when scrolling down, show when scrolling up
    if (currentScrollY > previousScrollY && currentScrollY > 100) {
      // Scrolling down
      headerOpacity.value = withTiming(0, { duration: 200 });
      searchOpacity.value = withTiming(0, { duration: 200 });
    } else if (currentScrollY < previousScrollY || currentScrollY < 50) {
      // Scrolling up or near top
      headerOpacity.value = withTiming(1, { duration: 200 });
      searchOpacity.value = withTiming(1, { duration: 200 });
    }
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        {
          translateY: withTiming(headerOpacity.value === 0 ? -100 : 0, { duration: 200 }),
        },
      ],
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchOpacity.value,
      transform: [
        {
          translateY: withTiming(searchOpacity.value === 0 ? -60 : 0, { duration: 200 }),
        },
      ],
    };
  });

  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [
        {
          translateY: withTiming(listOpacity.value === 0 ? 30 : 0, { duration: 800 }),
        },
      ],
    };
  });

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

  const renderSubjectCard = ({ item, index }: { item: Subject; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 100,
      }}
      style={{ marginBottom: 16 }}>
      <SubjectCard subject={item} onPress={handleSubjectPress} />
    </MotiView>
  );

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 300 }}
      style={styles.emptyContainer}>
      <MotiText
        from={{ opacity: 0, rotate: '-10deg' }}
        animate={{ opacity: 1, rotate: '0deg' }}
        transition={{ type: 'spring', delay: 500 }}
        style={styles.emptyIcon}>
        📚
      </MotiText>
      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 700 }}
        style={styles.emptyTitle}>
        Tidak ada mata pelajaran
      </MotiText>
      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 900 }}
        style={styles.emptyDescription}>
        {searchQuery ? 'Coba kata kunci yang berbeda' : 'Belum ada konten tersedia'}
      </MotiText>
    </MotiView>
  );

  const renderError = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      style={styles.errorContainer}>
      <MotiText
        from={{ opacity: 0, rotate: '10deg' }}
        animate={{ opacity: 1, rotate: '0deg' }}
        transition={{ type: 'spring', delay: 200 }}
        style={styles.errorIcon}>
        ⚠️
      </MotiText>
      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 400 }}
        style={styles.errorTitle}>
        Terjadi Kesalahan
      </MotiText>
      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 600 }}
        style={styles.errorDescription}>
        {subjectsError}
      </MotiText>
    </MotiView>
  );

  const getDisplayData = () => {
    if (searchQuery.trim()) {
      return searchResults.subjects;
    }
    return subjects;
  };

  const isLoading = subjectsLoading || (searchQuery.trim() && searchLoading);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.purple} />

      {/* Animated Header */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { zIndex: 10 }, headerAnimatedStyle]}>
        <LinearGradient
          colors={[colors.purple, colors.lightPurple, colors.lightGrayPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>
          <SafeAreaView>
            <MotiView
              from={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
              style={styles.headerContent}>
              <View style={styles.headerText}>
                <MotiText
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 200 }}
                  style={styles.title}>
                  Pilih Mata Pelajaran
                </MotiText>
                <MotiText
                  from={{ opacity: 0, translateX: -30 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 600, delay: 400 }}
                  style={styles.subtitle}>
                  Selamat datang, {user?.user_metadata?.full_name || user?.email}! 👋
                </MotiText>
                <MotiText
                  from={{ opacity: 0, translateX: 30 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 600, delay: 600 }}
                  style={styles.description}>
                  Mulai perjalanan belajar Anda dengan memilih mata pelajaran
                </MotiText>
              </View>
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 800 }}>
                <BlurView intensity={20} style={styles.logoutButton}>
                  <TouchableOpacity
                    style={styles.logoutButtonInner}
                    onPress={handleLogout}
                    activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={22} color={colors.white} />
                  </TouchableOpacity>
                </BlurView>
              </MotiView>
            </MotiView>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Animated Search Bar */}
      <Animated.View style={[styles.searchContainer, { zIndex: 9 }, searchAnimatedStyle]}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 1000 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={handleClearSearch}
            placeholder="Cari mata pelajaran..."
          />
        </MotiView>
      </Animated.View>

      {/* Animated Content */}
      <Animated.View style={[{ flex: 1 }, listAnimatedStyle]}>
        {isLoading ? (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}>
            <Loading text="Memuat mata pelajaran..." />
          </MotiView>
        ) : subjectsError ? (
          renderError()
        ) : (
          <Animated.FlatList
            data={getDisplayData()}
            renderItem={renderSubjectCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
      </Animated.View>

      {/* Animated Search Stats */}
      {searchQuery.trim() && (
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 50 }}
          transition={{ type: 'spring' }}>
          <BlurView intensity={80} style={styles.searchStats}>
            <Text style={styles.searchStatsText}>
              {searchResults.subjects.length} mata pelajaran ditemukan
            </Text>
          </BlurView>
        </MotiView>
      )}
    </View>
  );
}

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
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerText: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 24,
    fontWeight: '400',
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoutButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    marginTop: 140, // Adjust based on header height
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 20,
    opacity: 0.7,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.blackGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.blackGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 100,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  searchStats: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchStatsText: {
    fontSize: 14,
    color: colors.blackGray,
    textAlign: 'center',
    fontWeight: '500',
  },
});
