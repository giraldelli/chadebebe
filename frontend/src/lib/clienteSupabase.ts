import { createClient } from '@supabase/supabase-js';

const urlSupabase = import.meta.env.VITE_SUPABASE_URL || '';
const chaveAnonimaSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const clienteSupabase = (urlSupabase && chaveAnonimaSupabase)
  ? createClient(urlSupabase, chaveAnonimaSupabase)
  : null;

