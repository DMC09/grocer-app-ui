"use client";

import { Box, AppBar, Toolbar, IconButton } from "@mui/material";
import { Typography, Button } from "@supabase/ui";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "../supabase-provider";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";

export default function Header() {
  const { supabase } = useSupabase();

  const [user, setUser] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data) {
      setSession(data?.session);
      setUser(data?.session?.user);
    } else {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await setSession(null);
    await setUser(null);
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <Box >
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "right" }}>
          {!user ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
              onlyThirdPartyProviders
              theme="dark"
            />
          ) : (
            <Button  onClick={handleSignOut} color="inherit">
              Sign out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
