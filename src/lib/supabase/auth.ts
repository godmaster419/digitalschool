import { createClient, isSupabaseConfigured } from "./client";

export interface AdminProfile {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  isDemo?: boolean;
}

export const DEMO_ADMIN: AdminProfile = {
  id: "demo-admin-id",
  email: "admin@digitalschool.edu",
  role: "superadmin",
  fullName: "System Administrator",
  isDemo: true,
};

const LOCAL_STORAGE_SESSION_KEY = "digital_school_admin_session";

/**
 * Sign in an administrator.
 * 1. Authenticates with Supabase Auth (email & password).
 * 2. Checks public.admin_users to ensure the user is an authorized admin.
 * If Supabase is not configured, allows local demo login for testing.
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; profile?: AdminProfile }> {
  const configured = isSupabaseConfigured();

  // If Supabase credentials are not configured yet, support demo mode
  if (!configured) {
    if (email === "admin@digitalschool.edu" && password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(DEMO_ADMIN));
        document.cookie = `ds_admin_session=demo; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      return { success: true, profile: DEMO_ADMIN };
    }
    return {
      success: false,
      error:
        "Supabase credentials are not configured in .env.local. You can sign in using Demo Admin: admin@digitalschool.edu / admin123, or add your Supabase credentials.",
    };
  }

  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || "Invalid email or password.",
      };
    }

    // Authorization verification: query admin_users table
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, role, full_name")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      // User is authenticated, but NOT in admin_users -> access denied!
      await supabase.auth.signOut();
      return {
        success: false,
        error:
          "Access Denied: Your account does not have administrator privileges. Please contact the administrator.",
      };
    }

    const admin = adminRecord as any;
    const profile: AdminProfile = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.full_name || undefined,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
      document.cookie = `ds_admin_session=active; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }

    return { success: true, profile };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during login.",
    };
  }
}

/**
 * Sign out administrator
 */
export async function signOutAdmin(): Promise<void> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
  } catch {
    // ignore
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      document.cookie = "ds_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}

/**
 * Retrieve current admin profile from localStorage or Supabase session
 */
export async function getClientAdminProfile(): Promise<AdminProfile | null> {
  if (typeof window === "undefined") return null;

  try {
    // Check localStorage first
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (stored) {
      const parsed: AdminProfile = JSON.parse(stored);
      if (parsed.isDemo) return parsed;
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        return null;
      }

      // Check admin_users
      const { data: adminRecord } = await supabase
        .from("admin_users")
        .select("id, email, role, full_name")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (adminRecord) {
        const admin = adminRecord as any;
        const profile: AdminProfile = {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          fullName: admin.full_name || undefined,
          isDemo: false,
        };
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
        return profile;
      }
    }
  } catch {
    // fallback
  }

  return null;
}
