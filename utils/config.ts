import Constants from 'expo-constants';
import { Env } from '@/types';

const config = {
  env: (Constants.expoConfig?.extra?.env as Env) || Env.dev,
  apiUrl: (Constants.expoConfig?.extra?.apiUrl as string) || 'http://localhost:3000',
  supabaseKey:
    (Constants.expoConfig?.extra?.supabaseKey as string) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXhubHhkdGRycWJic3hpZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjI0MzMsImV4cCI6MjA1MDAwMjQzM30.6I4OJjh6KBXRN7dPaB5VhMdC3YLONOKdUZXDHNRFZ9A',
  // Google OAuth Credentials
  webOAuthId:
    (Constants.expoConfig?.extra?.webOAuthId as string) ||
    'your-web-client-id.googleusercontent.com',
  webOAuthSecret:
    (Constants.expoConfig?.extra?.webOAuthSecret as string) || 'your-web-client-secret',
  androidOAuthId:
    (Constants.expoConfig?.extra?.androidOAuthId as string) ||
    'your-android-client-id.googleusercontent.com',
} as const satisfies {
  env: Env;
  apiUrl: string;
  supabaseKey: string;
  webOAuthId: string;
  webOAuthSecret: string;
  androidOAuthId: string;
};

export default config;
