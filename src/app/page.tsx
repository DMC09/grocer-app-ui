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

  // Use the layout.tsx of the [grocerytoreid] to try an make this a server component but make the logici nthe tempalte

  const [sessionData, setSessionData] = useState<Session | null>(session);

  useEffect(() => {
    sessionData?.user ? router.push("/dashboard") : router.push("/login");
  }, []);

  // const supabase = createServerComponentSupabaseClient({
  //   headers,
  //   cookies,
  // });

  return <></>;
}
