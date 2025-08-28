import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const expoProjectId = process.env.EXPO_PROJECT_ID ?? '465c0494-df0c-42c2-88e7-85473aa912d9';
  const expoConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_SLUG ?? 'educate',
    name: process.env.EXPO_NAME ?? 'Educate',
    scheme: 'educate', // Important for deep linking
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.EXPO_IOS_BUNDLE_IDENTIFIER ?? 'com.educate.app',
    },
    android: {
      ...config.android,
      package: process.env.EXPO_ANDROID_PACKAGE ?? 'com.educate.app',
    },
    web: {
      ...config.web,
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/logo-sm.png',
    },
    updates: {
      url: `https://u.expo.dev/${expoProjectId}`,
    },
    extra: {
      ...config.extra,
      eas: { projectId: expoProjectId },
      env: process.env.ENV ?? 'development',
      apiUrl: process.env.API_URL ?? 'https://ubexnlxdtdrqbbsxiexi.supabase.co',
      supabaseKey:
        process.env.SUPABASE_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXhubHhkdGRycWJic3hpZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjI0MzMsImV4cCI6MjA1MDAwMjQzM30.6I4OJjh6KBXRN7dPaB5VhMdC3YLONOKdUZXDHNRFZ9A',
      webOAuthId:
        process.env.WEB_OAUTH_ID ??
        '292474871516-vtgi44pradraqeo4km9r2hnbqpp4sk9g.apps.googleusercontent.com',
      webOAuthSecret: process.env.WEB_OAUTH_SECRET ?? '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',
      androidOAuthId:
        process.env.ANDROID_OAUTH_ID ??
        '292474871516-prppt054chsnutr515lndd1cg061k1tm.apps.googleusercontent.com',
    },
    plugins: [
      'expo-router',
      'expo-asset',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#101212',
          },
          image: './assets/images/logo-lg.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/OpenSans-Bold.ttf',
            './assets/fonts/OpenSans-BoldItalic.ttf',
            './assets/fonts/OpenSans-Italic.ttf',
            './assets/fonts/OpenSans-Regular.ttf',
            './assets/fonts/OpenSans-Semibold.ttf',
            './assets/fonts/OpenSans-SemiboldItalic.ttf',
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
  // console.log('[##] expo config', expoConfig);
  return expoConfig;
};
