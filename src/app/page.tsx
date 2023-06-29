"use client";

import {
  Session,
} from "@supabase/auth-helpers-nextjs";
import { useSupabase } from "./components/supabase/supabase-provider";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";

// do not cache this page
export const revalidate = 0;

export default function HomePage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [sessionData] = useState<Session | null>(session);

  useEffect(() => {
    sessionData?.user ? router.push("/dashboard") : router.push("/login");
  }, []);


//if user go straight to the dashboard.
//if no user show landing page that has a button to login.
  return <></>;
}
