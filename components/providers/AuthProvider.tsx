import React, { useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/utils/store';
import { setAuthState, initializeAuth } from '@/slices/authSlice';
import { AuthService } from '@/services/authService';

import { AuthUser } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      // Initialize auth state
      dispatch(initializeAuth());

      // Listen to auth changes
      const {
        data: { subscription },
      } = AuthService.onAuthStateChange((event, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id);

        const user = (session?.user as AuthUser) || null;

        dispatch(
          setAuthState({
            user,
            session,
          }),
        );

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated:', user?.email);
            break;
        }
      });

      // Cleanup subscription
      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('AuthProvider initialization error:', error);
    }
  }, [dispatch]);

  return <>{children}</>;
}
