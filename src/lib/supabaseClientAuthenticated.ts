import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// This function can be called from any server action
export async function getAuthenticatedSupabaseClient() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.supabaseAccessToken) {
    throw new Error("User is not properly authenticated.");
  }

  // Create and return a new Supabase client authenticated as the current user
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${session.supabaseAccessToken}`,
        },
      },
    }
  );

  return { supabase, session };
}