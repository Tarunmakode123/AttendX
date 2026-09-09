import { createClient } from '@supabase/supabase-js';

// Environment variables for live Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if live Supabase is configured
export const isLiveSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
