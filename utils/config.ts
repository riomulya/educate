import Constants from 'expo-constants';
import { Env } from '@/types';

const config = {
  env: (Constants.expoConfig?.extra?.env as Env) || Env.dev,
  apiUrl:
    (Constants.expoConfig?.extra?.apiUrl as string) || 'https://ubexnlxdtdrqbbsxiexi.supabase.co',
  supabaseKey:
    (Constants.expoConfig?.extra?.supabaseKey as string) ||
    'sb_secret_lIPtkmxGbdv7-gXupNN8zA_j2LcOEUN',
} as const satisfies {
  env: Env;
  apiUrl: string;
  supabaseKey: string;
};

export default config;
