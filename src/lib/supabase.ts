import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getStoredCode } from "./coupleCode";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
  }
  const code = getStoredCode() ?? "";
  client = createClient(url, key, {
    global: {
      headers: { "x-couple-code": code },
    },
  });
  return client;
}

export function resetSupabase() {
  client = null;
}
