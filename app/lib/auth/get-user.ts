"use client";

import { supabase } from "@/app/lib/supabase/client";
import { useState, useEffect } from "react";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proveri trenutnu sesiju
    checkUser();

    // Slušaj promene u auth stanju
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Dohvati profile podatke
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: profile?.full_name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Dohvati profile podatke
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: profile?.full_name,
        });
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, logout };
}
