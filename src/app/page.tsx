"use client";

import {
  Session,
  User,
  createServerComponentSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";
import { useSupabase } from "./components/supabase/supabase-provider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// do not cache this page
export const revalidate = 0;

export default function HomePage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [sessionData, setSessionData] = useState<Session | null>(session);

  useEffect(() => {
    sessionData?.user ? router.push("/dashboard") : router.push("/login");
  }, []);

  return <></>;
}
