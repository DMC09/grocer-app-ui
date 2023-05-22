import { Database } from '@/lib/supabase';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';


export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>();