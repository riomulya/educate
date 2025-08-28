import React, { useEffect, ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/utils/store';
import { setAuthState, setLoading } from '@/slices/authSlice';
import { AuthService } from '@/services/authService';
import { useAutoLogin } from '@/hooks/useAutoLogin';

import { AuthUser } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { checkAutoLogin } = useAutoLogin();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing AuthProvider with AsyncStorage...');
        dispatch(setLoading(true));

        // Setup auth state listener FIRST to catch session restoration
        const {
          data: { subscription },
        } = AuthService.onAuthStateChange((event, session: Session | null) => {
          console.log('Auth state changed:', event, session?.user?.id || 'none');

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
              console.log('✅ User signed in:', user?.email);
              break;
            case 'SIGNED_OUT':
              console.log('🚪 User signed out');
              break;
            case 'TOKEN_REFRESHED':
              console.log('🔄 Token refreshed for:', user?.email);
              break;
            case 'INITIAL_SESSION':
              if (session?.user) {
                console.log('✅ Session restored from AsyncStorage:', user?.email);
              } else {
                console.log('ℹ️ No session found in AsyncStorage, checking auto-login...');
                // Only try auto-login if no session was restored
                checkAutoLogin();
              }
              break;
          }
        });

        // Get initial session (this will trigger INITIAL_SESSION event)
        await AuthService.getCurrentSession();

        setIsInitialized(true);
        dispatch(setLoading(false));

        // Cleanup subscription
        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('❌ AuthProvider initialization error:', error);
        setIsInitialized(true);
        dispatch(setLoading(false));
      }
    };

    if (!isInitialized) {
      initializeApp();
    }
  }, [dispatch, checkAutoLogin, isInitialized]);

  return <>{children}</>;
}
