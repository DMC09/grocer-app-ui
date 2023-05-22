"use client";

import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "../components/supabase/supabase-provider";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    session?.user ? router.push("/dashboard") : router.push("/login");
  }, []);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexFlow: "center",
          justifyContent: "center",
          backgroundColor: "secondary.light",
          border: 5,
        }}
      >
        <Box>
          <Typography variant="body1" color="text.secondary">
            Please sign in to use
          </Typography>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            theme="dark"
          />
        </Box>
      </Container>
    </>
  );
}
