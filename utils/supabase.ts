import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '@/utils/config';

const supabaseUrl = 'https://ubexnlxdtdrqbbsxiexi.supabase.co';
const supabaseKey = config.supabaseKey || process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  throw new Error('Supabase key is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
