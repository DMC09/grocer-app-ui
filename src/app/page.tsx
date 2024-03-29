"use client";

import { useSupabase } from "@/components/supabase/supabase-provider";
import { Session } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Do not cache this page
export const revalidate = 0;

export default function HomePage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [sessionData] = useState<Session | null>(session);

  useEffect(() => {

    sessionData?.user ? router.push("/dashboard") : router.push("/login");
  }, []);

  return <></>;
}
