import React, { useEffect, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/utils/store';
import Loading from '@/components/elements/Loading';
import { colors } from '@/theme/colors';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to sign in if authentication is required but user is not authenticated
        router.replace('/auth/sign-in');
      } else if (!requireAuth && isAuthenticated) {
        // Redirect to main app if user is already authenticated and trying to access auth pages
        router.replace('/education');
      }
    }
  }, [loading, isAuthenticated, requireAuth]);

  // Show loading while checking authentication status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading text="Memuat..." />
      </View>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <Loading text="Mengalihkan..." />
      </View>
    );
  }

  // If auth is not required but user is authenticated, don't render children
  if (!requireAuth && isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <Loading text="Mengalihkan..." />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
});
