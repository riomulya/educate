import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
}

export type AuthProvider = 'google' | 'facebook' | 'apple';

export interface AuthError {
  message: string;
  code?: string;
} 