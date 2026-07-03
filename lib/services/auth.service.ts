import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Roles supported in your SaaS
 */
export type UserRole = "user" | "creator" | "advertiser" | "admin";

export const authService = {
  /* =========================
     GET CURRENT USER
  ========================= */
  async getCurrentUser() {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    return user;
  },

  /* =========================
     GET USER PROFILE (WITH ROLE)
  ========================= */
  async getUserProfile(userId: string) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new Error("Profile not found");
    }

    return data;
  },

  /* =========================
     REQUIRE AUTH (BASIC GUARD)
  ========================= */
  async requireAuth() {
    const user = await this.getCurrentUser();
    const profile = await this.getUserProfile(user.id);

    return { user, profile };
  },

  /* =========================
     REQUIRE ROLE
  ========================= */
  async requireRole(allowedRoles: UserRole[]) {
    const { user, profile } = await this.requireAuth();

    if (!allowedRoles.includes(profile.role)) {
      throw new Error("Forbidden: insufficient permissions");
    }

    return { user, profile };
  },

  /* =========================
     ADMIN GUARD (STRICT)
  ========================= */
  async requireAdmin() {
    return this.requireRole(["admin"]);
  },

  /* =========================
     CREATOR GUARD
  ========================= */
  async requireCreator() {
    return this.requireRole(["creator", "admin"]);
  },

  /* =========================
     ADVERTISER GUARD
  ========================= */
  async requireAdvertiser() {
    return this.requireRole(["advertiser", "admin"]);
  },
};





