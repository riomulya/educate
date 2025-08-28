import { useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { AppDispatch } from '@/utils/store';
import { setAuthState, setLoading } from '@/slices/authSlice';
import { supabase } from '@/utils/supabase';
import { SignInCredentials, SignUpCredentials, AuthUser } from '@/types/auth';
import { useAutoLogin } from './useAutoLogin';

interface UseEmailAuthReturn {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useEmailAuth = (): UseEmailAuthReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { saveAutoLoginData, clearAutoLoginData } = useAutoLogin();
  const [loading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (credentials: SignInCredentials) => {
    setLocalLoading(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      console.log('🔑 Attempting sign in with email/password');

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw signInError;
      }

      if (data?.user && data?.session) {
        console.log('✅ User authenticated:', data.user.email);

        // Update Redux state
        dispatch(
          setAuthState({
            user: data.user as AuthUser,
            session: data.session,
          }),
        );

        // Save auto-login data for 1-day auto login
        await saveAutoLoginData(data.user.id, data.user.email);

        // Navigate to main app
        router.replace('/education');
      } else {
        throw new Error('Login berhasil tetapi data user tidak ditemukan');
      }
    } catch (error: any) {
      console.error('❌ Sign in failed:', error);

      let errorMessage = 'Terjadi kesalahan saat masuk';

      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Email atau password salah';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      Alert.alert('Gagal Masuk', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setLocalLoading(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      console.log('📝 Attempting sign up with email/password');

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
          },
        },
      });

      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        throw signUpError;
      }

      if (data?.user) {
        console.log('✅ User registered:', data.user.email);

        if (!data.session) {
          // User needs to confirm email
          Alert.alert('Pendaftaran Berhasil', 'Silakan cek email Anda untuk konfirmasi akun.', [
            { text: 'OK', onPress: () => router.replace('/auth/sign-in') },
          ]);
        } else {
          // User is automatically signed in
          dispatch(
            setAuthState({
              user: data.user as AuthUser,
              session: data.session,
            }),
          );

          // Save auto-login data for sign up with auto login
          await saveAutoLoginData(data.user.id, data.user.email);

          Alert.alert('Pendaftaran Berhasil', 'Selamat datang di aplikasi kami!', [
            { text: 'OK', onPress: () => router.replace('/education') },
          ]);
        }
      } else {
        throw new Error('Pendaftaran berhasil tetapi data user tidak ditemukan');
      }
    } catch (error: any) {
      console.error('❌ Sign up failed:', error);

      let errorMessage = 'Terjadi kesalahan saat mendaftar';

      if (error.message === 'User already registered') {
        errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk';
      } else if (error.message === 'Password should be at least 6 characters') {
        errorMessage = 'Password harus minimal 6 karakter';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      Alert.alert('Gagal Mendaftar', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    setLocalLoading(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      console.log('🚪 Signing out...');

      // Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

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
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };
};

export default useEmailAuth;
