"use client";

import { useSupabase } from "@/components/supabase/supabase-provider";
import { Session } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// do not cache this page
export const revalidate = 0;

export default function HomePage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [sessionData] = useState<Session | null>(session);

  useEffect(() => {
    console.log(session, "session info");
    console.log(supabase, "supabase info");

    sessionData?.user ? router.push("/dashboard") : router.push("/login");
  }, [
    // need to see if the sesion is expire if so perform a refresh here
  ]);

  //if user go straight to the dashboard.
  //if no user show landing page that has a button to login.
  return <></>;
}
