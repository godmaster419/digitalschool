import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes("your-project-id") &&
    !key.includes("your-anon-public-key") &&
    url.startsWith("http")
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(url, key);
  }
  return clientInstance;
}
