// import { createClient } from '@supabase/supabase-js'
// import { getServerSession } from 'next-auth'

// export async function getSupabaseClientAuthenticated() {
//   const session = await getServerSession();
//   const supabaseAccessToken = session?.supabaseAccessToken;

//   if (!supabaseAccessToken) {
//     throw new Error("User is not authenticated or Supabase access token is missing.");
//   }

//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       global: {
//         headers: {
//           Authorization: `Bearer ${supabaseAccessToken}`,
//         },
//       },
//     }
//   );

//   return supabase;
// }