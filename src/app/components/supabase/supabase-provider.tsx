"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  Session,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";

type MaybeSession = Session | null;

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  session: MaybeSession;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MaybeSession;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") {
        console.log('Signed in Event in the provider');
        router.push("/dashboard");
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT") {
        console.log('Signed out Event in the provider');
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
