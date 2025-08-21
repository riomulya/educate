import { supabase } from '@/utils/supabase';
import {
  SignInCredentials,
  SignUpCredentials,
  ResetPasswordCredentials,
  UpdateProfileData,
  AuthProvider,
  AuthUser,
} from '@/types/auth';
import { AuthError } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn({ email, password }: SignInCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { user: data.user as AuthUser, session: data.session };
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp({ email, password, fullName }: SignUpCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      return { user: data.user as AuthUser, session: data.session };
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign in with OAuth provider (Google, Facebook, Apple)
   */
  static async signInWithOAuth(provider: AuthProvider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'exp://localhost:8081/--/auth/callback', // For Expo development
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword({ email }: ResetPasswordCredentials) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:8081/--/auth/reset-password',
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileData) {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return user as AuthUser;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return session;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Handle auth errors and provide user-friendly messages
   */
  private static handleAuthError(error: AuthError): Error {
    let message = 'Terjadi kesalahan yang tidak diketahui';

    switch (error.message) {
      case 'Invalid login credentials':
        message = 'Email atau password tidak valid';
        break;
      case 'Email not confirmed':
        message = 'Email belum dikonfirmasi. Silakan cek email Anda';
        break;
      case 'User already registered':
        message = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk';
        break;
      case 'Password should be at least 6 characters':
        message = 'Password harus minimal 6 karakter';
        break;
      case 'Unable to validate email address: invalid format':
        message = 'Format email tidak valid';
        break;
      case 'Email rate limit exceeded':
        message = 'Terlalu banyak percobaan. Silakan coba lagi nanti';
        break;
      default:
        message = error.message || 'Terjadi kesalahan saat autentikasi';
    }

    return new Error(message);
  }
}
