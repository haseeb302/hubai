// import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// Helper function to get authenticated supabase client
// export async function getAuthenticatedSupabaseClient() {
//   const session = await auth();
//   if (!session) {
//     throw new Error("No session found");
//   }

//   return createClient(supabaseUrl, supabaseAnonKey, {
//     auth: {
//       persistSession: false,
//       autoRefreshToken: false,
//       detectSessionInUrl: false,
//     },
//     global: {
//       headers: {
//         Authorization: `Bearer ${session.user.id}`,
//       },
//     },
//   });
// }
