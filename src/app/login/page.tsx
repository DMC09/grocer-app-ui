"use client";

import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "../supabase-provider";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { Box, Container, Typography } from "@mui/material";

export default function LoginPage() {
  const { supabase } = useSupabase();

  return (
    <>
      <Container
    maxWidth={false}
      sx={{display: 'flex',flexFlow:"center",justifyContent: 'center',backgroundColor:"primary.light",border:2}}
      >
        <Box 
        
        >

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
