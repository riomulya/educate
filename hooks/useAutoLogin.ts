import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { AppDispatch } from '@/utils/store';
import { setAuthState, setLoading } from '@/slices/authSlice';
import { supabase } from '@/utils/supabase';
import { useDataPersist, DataPersistKeys } from './useDataPersist';
import { AuthUser } from '@/types/auth';

interface AutoLoginData {
  timestamp: number;
  userId: string;
  userEmail?: string;
  expiresAt: number;
}

interface UseAutoLoginReturn {
  saveAutoLoginData: (userId: string, userEmail?: string) => Promise<void>;
  checkAutoLogin: () => Promise<boolean>;
  clearAutoLoginData: () => Promise<void>;
  isAutoLoginValid: (autoLoginData: AutoLoginData) => boolean;
}

export const useAutoLogin = (): UseAutoLoginReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { setPersistData, getPersistData, removePersistData } = useDataPersist();

  // Auto-login duration: 1 day (24 hours in milliseconds)
  const AUTO_LOGIN_DURATION = 24 * 60 * 60 * 1000;

  /**
   * Check if auto-login timestamp is still valid (within 1 day)
   */
  const isAutoLoginValid = (autoLoginData: AutoLoginData): boolean => {
    const now = Date.now();
    const timeDifference = now - autoLoginData.timestamp;
    const isWithinDuration = timeDifference < AUTO_LOGIN_DURATION;
    const isNotExpired = now < autoLoginData.expiresAt;

    return isWithinDuration && isNotExpired;
  };

  /**
   * Save auto-login data when user successfully logs in
   */
  const saveAutoLoginData = async (userId: string, userEmail?: string): Promise<void> => {
    try {
      const now = Date.now();
      const autoLoginData: AutoLoginData = {
        timestamp: now,
        userId,
        userEmail,
        expiresAt: now + AUTO_LOGIN_DURATION,
      };

      await setPersistData(DataPersistKeys.AUTO_LOGIN_TIMESTAMP, autoLoginData);
      console.log('✅ Auto-login data saved successfully for user:', userEmail || userId);
      console.log(
        '✅ Auto-login will be valid until:',
        new Date(autoLoginData.expiresAt).toLocaleString(),
      );
    } catch (error) {
      console.error('❌ Failed to save auto-login data:', error);
    }
  };

  /**
   * Check and perform auto-login if valid
   */
  const checkAutoLogin = async (): Promise<boolean> => {
    try {
      console.log('🔍 Checking for auto-login...');

      // Get saved auto-login data
      const autoLoginData = await getPersistData<AutoLoginData>(
        DataPersistKeys.AUTO_LOGIN_TIMESTAMP,
      );

      if (!autoLoginData) {
        console.log('ℹ️ No auto-login data found');
        return false;
      }

      // Check if auto-login is still valid (within 1 day)
      if (!isAutoLoginValid(autoLoginData)) {
        console.log('⏰ Auto-login expired, clearing data...');
        console.log('Expired at:', new Date(autoLoginData.expiresAt).toLocaleString());
        await clearAutoLoginData();
        return false;
      }

      console.log(
        '✅ Auto-login data is valid, timestamp:',
        new Date(autoLoginData.timestamp).toLocaleString(),
      );

      // Try to get current session from Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Error getting session:', error);
        // Don't clear auto-login data on session error - might be temporary
        return false;
      }

      if (session?.user && session.user.id === autoLoginData.userId) {
        console.log('✅ Auto-login successful for user:', session.user.email);

        // Update Redux state
        dispatch(
          setAuthState({
            user: session.user as AuthUser,
            session,
          }),
        );

        // Navigate to main app
        router.replace('/education');
        return true;
      } else if (!session) {
        console.log('ℹ️ No session found, but auto-login data is valid');
        console.log('Expected user ID:', autoLoginData.userId);
        console.log("This might be expected if session hasn't been restored from AsyncStorage yet");

        // Don't clear auto-login data if no session - AsyncStorage session might be loading
        return false;
      } else {
        console.log('❌ User mismatch detected, clearing auto-login data');
        console.log('Expected user ID:', autoLoginData.userId);
        console.log('Actual session user ID:', session.user?.id || 'none');
        await clearAutoLoginData();
        return false;
      }
    } catch (error) {
      console.error('❌ Auto-login check failed:', error);
      // Don't clear auto-login data on error - might be temporary network issue
      return false;
    }
  };

  /**
   * Clear auto-login data (when user logs out or data expires)
   */
  const clearAutoLoginData = async (): Promise<void> => {
    try {
      await removePersistData(DataPersistKeys.AUTO_LOGIN_TIMESTAMP);
      console.log('✅ Auto-login data cleared');
    } catch (error) {
      console.error('❌ Failed to clear auto-login data:', error);
    }
  };

  return {
    saveAutoLoginData,
    checkAutoLogin,
    clearAutoLoginData,
    isAutoLoginValid,
  };
};

export default useAutoLogin;
