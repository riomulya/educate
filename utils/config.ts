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
    '292474871516-vtgi44pradraqeo4km9r2hnbqpp4sk9g.apps.googleusercontent.com',
  webOAuthSecret:
    (Constants.expoConfig?.extra?.webOAuthSecret as string) ||
    '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',
  androidOAuthId:
    (Constants.expoConfig?.extra?.androidOAuthId as string) ||
    '292474871516-prppt054chsnutr515lndd1cg061k1tm.apps.googleusercontent.com',
} as const satisfies {
  env: Env;
  apiUrl: string;
  supabaseKey: string;
  webOAuthId: string;
  webOAuthSecret: string;
  androidOAuthId: string;
};

export default config;
