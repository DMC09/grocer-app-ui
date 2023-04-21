"use client";

import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "../supabase-provider";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";

export default function LoginPage() {
  const { supabase } = useSupabase();

  return (
    <>
      Please Login to start using the app
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
        onlyThirdPartyProviders
        theme="dark"
      />
    </>
  );
}
