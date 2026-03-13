import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  unit: string;
  is_available: boolean;
  created_at: string;
}
