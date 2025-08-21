import { createClient } from '@supabase/supabase-js';
import config from '@/utils/config';

const supabaseUrl = 'https://ubexnlxdtdrqbbsxiexi.supabase.co';
const supabaseKey = config.supabaseKey || process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  throw new Error('Supabase key is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
