import 'dotenv/config';

export default {
  expo: {
    name: 'educate',
    slug: 'educate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    extra: {
      env: process.env.NODE_ENV || 'development',
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      supabaseKey:
        process.env.SUPABASE_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXhubHhkdGRycWJic3hpZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjI0MzMsImV4cCI6MjA1MDAwMjQzM30.6I4OJjh6KBXRN7dPaB5VhMdC3YLONOKdUZXDHNRFZ9A',
      // Google OAuth Credentials
      webOAuthId: process.env.WEB_OAUTH_ID || 'your-web-client-id.googleusercontent.com',
      webOAuthSecret: process.env.WEB_OAUTH_SECRET || 'your-web-client-secret',
      androidOAuthId:
        process.env.ANDROID_OAUTH_ID || 'your-android-client-id.googleusercontent.com',
      eas: {
        projectId: 'your-project-id-here',
      },
    },
    scheme: 'educate',
    experiments: {
      typedRoutes: false,
    },
    plugins: ['expo-router'],
  },
};
