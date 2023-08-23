
import { Database } from '@/types';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';


export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>();