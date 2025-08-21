import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/utils/store';
import Loading from '@/components/elements/Loading';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export default function Index() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/education');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [loading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Loading text="Memuat aplikasi..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
});
