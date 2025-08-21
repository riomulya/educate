import { useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppDispatch } from '@/utils/store';
import { setAuthState } from '@/slices/authSlice';
import { supabase } from '@/utils/supabase';
import { AuthUser } from '@/types/auth';

// This is required for Expo WebBrowser
WebBrowser.maybeCompleteAuthSession();

interface UseExpoGoogleAuthReturn {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useExpoGoogleAuth = (): UseExpoGoogleAuthReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting Expo Google Sign-In...');

      // Use Supabase OAuth with mobile redirect
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Force mobile redirect for Expo app
          redirectTo: 'educate://auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account', // This will show Google account picker
            include_granted_scopes: 'true',
          },
        },
      });

      if (oauthError) {
        console.error('❌ Supabase OAuth error:', oauthError);
        throw oauthError;
      }

      if (data?.url) {
        console.log('🌐 Opening OAuth URL:', data.url);

        // Open OAuth URL in browser - this will show Google account picker
        // Use mobile redirect URI for proper app return
        const result = await WebBrowser.openAuthSessionAsync(data.url, 'educate://auth/callback', {
          showInRecents: false,
        });

        console.log('📱 OAuth result:', result);

        if (result.type === 'success') {
          console.log('✅ OAuth success! URL:', result.url);

          // Extract tokens from URL if needed
          if (result.url) {
            const url = new URL(result.url);
            const accessToken = url.searchParams.get('access_token');
            const refreshToken = url.searchParams.get('refresh_token');

            if (accessToken) {
              console.log('🔑 Access token received');

              // Show success message
              Alert.alert('Berhasil!', 'Berhasil masuk dengan Google!', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/education');
                  },
                },
              ]);
            }
          }
        } else if (result.type === 'cancel') {
          console.log('❌ User cancelled OAuth');
          throw new Error('Login dibatalkan');
        } else if (result.type === 'dismiss') {
          console.log('❌ OAuth dismissed');
          throw new Error('Login ditutup');
        }
      } else {
        throw new Error('Tidak dapat membuka halaman login Google');
      }
    } catch (error: any) {
      console.error('❌ Expo Google Sign-In failed:', error);

      const errorMessage = error.message || 'Terjadi kesalahan saat masuk dengan Google';
      setError(errorMessage);

      Alert.alert('Gagal Masuk', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚪 Signing out...');

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Update Redux auth state
      dispatch(
        setAuthState({
          user: null,
          session: null,
        }),
      );

      console.log('✅ Sign out completed successfully');

      // Navigate to sign in screen
      router.replace('/auth/sign-in');
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);

      const errorMessage = error.message || 'Terjadi kesalahan saat keluar';
      setError(errorMessage);

      Alert.alert('Gagal Keluar', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signOut,
    loading,
    error,
  };
};

export default useExpoGoogleAuth;
