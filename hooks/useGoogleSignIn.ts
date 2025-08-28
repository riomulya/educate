import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import {
  GoogleSignin,
  statusCodes,
  SignInResponse,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/utils/supabase';
import config from '@/utils/config';
import { setAuthState } from '@/slices/authSlice';
import { AppDispatch } from '@/utils/store';
import { useAutoLogin } from './useAutoLogin';

interface UseGoogleSignInReturn {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useGoogleSignIn = (): UseGoogleSignInReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { saveAutoLoginData, clearAutoLoginData } = useAutoLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      // Web Client ID dari Google Cloud Console (OAuth 2.0 client ID)
      webClientId: config.webOAuthId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting Google Sign-In with native SDK...');

      // Check if play services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google - this will show account picker natively
      const userInfo: SignInResponse = await GoogleSignin.signIn();
      console.log('✅ Google Sign-In successful:', userInfo.data?.user?.email);

      // Get ID token from Google Sign-In
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('Tidak dapat mendapatkan token dari Google');
      }

      console.log('🔑 Got ID token, signing in with Supabase...');

      // Sign in with Supabase using Google ID token
      const { data, error: signInError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (signInError) {
        console.error('❌ Supabase sign in error:', signInError);
        throw signInError;
      }

      if (data?.user && data?.session) {
        console.log('✅ Supabase authentication successful');

        // Update Redux auth state
        dispatch(
          setAuthState({
            user: data.user,
            session: data.session,
          }),
        );

        // Save auto-login data for 1-day auto login
        await saveAutoLoginData(data.user.id, data.user.email);

        // Show success message and navigate
        Alert.alert('Berhasil!', 'Berhasil masuk dengan Google!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/education');
            },
          },
        ]);
      } else {
        throw new Error('Login berhasil tetapi data user tidak ditemukan');
      }
    } catch (error: any) {
      console.error('❌ Google Sign-In failed:', error);
      // Log lebih detail untuk debugging
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error('DEVELOPER_ERROR details:', JSON.stringify(error, null, 2));
        console.error('SHA-1 fingerprint mungkin tidak cocok atau konfigurasi client ID salah.');
      }

      let errorMessage = 'Terjadi kesalahan saat masuk dengan Google';

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Login dibatalkan';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Proses login sedang berjalan';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services tidak tersedia';
      } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Error konfigurasi Google Sign-In. Periksa SHA-1 dan Client ID.';
      } else if (error.message) {
        errorMessage = error.message;
      }

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

      // Sign out from Google
      await GoogleSignin.signOut();

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear auto-login data
      await clearAutoLoginData();

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

export default useGoogleSignIn;
