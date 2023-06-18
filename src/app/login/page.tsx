"use client";

import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "../components/supabase/supabase-provider";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashBoardSkeleton from "../components/skeletons/dashboardSkeleton";

export default function LoginPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    session?.user ? router.push("/dashboard") : router.push("/login");
  }, []);

  return (
    <>
     {/* {session?.user ? <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
        maxWidth={350}
        width={"100%"}
      >
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="dark"
        />
      </Box> :<DashBoardSkeleton/>} */}
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
        maxWidth={350}
        width={"100%"}
      >
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="dark"
        />
      </Box>
    </>
  );
}
