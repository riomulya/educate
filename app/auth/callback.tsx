import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import { AppDispatch } from '@/utils/store';
import { setAuthState } from '@/slices/authSlice';
import { supabase } from '@/utils/supabase';
import { colors } from '@/theme/colors';
import Loading from '@/components/elements/Loading';

export default function AuthCallback() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log('🔄 Processing OAuth callback...');
      console.log('📋 Callback params:', params);

      // Get current session from Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Session error:', error);
        throw error;
      }

      if (session?.user) {
        console.log('✅ User authenticated:', session.user.email);

        // Update Redux state
        dispatch(
          setAuthState({
            user: session.user as any,
            session: session,
          }),
        );

        // Show success message
        Alert.alert(
          'Berhasil!',
          `Selamat datang, ${session.user.user_metadata?.full_name || session.user.email}!`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/education');
              },
            },
          ],
        );
      } else {
        console.log('⚠️ No user session found');

        // Try to extract tokens from URL params
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;

        if (accessToken) {
          console.log('🔑 Found access token in params');

          // Set session with tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            throw sessionError;
          }

          if (data.user) {
            dispatch(
              setAuthState({
                user: data.user as any,
                session: data.session,
              }),
            );

            Alert.alert(
              'Berhasil!',
              `Selamat datang, ${data.user.user_metadata?.full_name || data.user.email}!`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/education');
                  },
                },
              ],
            );
          }
        } else {
          throw new Error('No authentication data found');
        }
      }
    } catch (error: any) {
      console.error('❌ Auth callback error:', error);

      Alert.alert('Gagal Masuk', error.message || 'Terjadi kesalahan saat memproses login', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/auth/sign-in');
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Loading text="Memproses login..." />
      <Text style={styles.subtitle}>
        Mohon tunggu, sedang menyelesaikan proses masuk dengan Google...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 24,
  },
});
