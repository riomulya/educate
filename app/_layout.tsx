import { Fragment, useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheet from '@/components/elements/BottomSheet';
import useColorScheme from '@/hooks/useColorScheme';
import { loadImages, loadFonts, colors } from '@/theme';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Provider from '@/providers';
import AuthProvider from '@/components/providers/AuthProvider';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Router() {
  const { isDark } = useColorScheme();
  const [isOpen, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  /**
   * preload assets
   */
  useEffect(() => {
    (async () => {
      try {
        // preload assets
        await Promise.all([loadImages(), loadFonts()]);

        // hide splash screen
        await SplashScreen.hideAsync();
        setIsReady(true);
        setOpen(true);
      } catch (error) {
        console.error('Error loading app:', error);
        // hide splash screen even if loading fails
        await SplashScreen.hideAsync();
        setIsReady(true);
        setOpen(true);
      }
    })();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Fragment>
      <Slot />
      <StatusBar style="light" />
    </Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Provider>
  );
}
