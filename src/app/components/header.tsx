"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import HomeIcon from "@mui/icons-material/Home";
import { useParams, useRouter } from "next/navigation";
import { theme } from "../utils/theme";

export default function Header() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [user, setUser] = useState<unknown>(null);
  // const [session, setSession] = useState<unknown>(null);

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data) {
      // setSession(data?.session);
      setUser(data?.session?.user);
    } else {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // await setSession(null);
    await setUser(null);
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
        }}
      >
        {/* must keep this so it always stays!! */}
        <AppBar sx={{ backgroundColor: "primary.dark" }} position="static">
          <Toolbar sx={{ justifyContent: "right" }}>
            <>
              <IconButton
                sx={{
                  color: "primary.light",
                }}
                onClick={() => router.push("/")}
              >
                <HomeIcon
                  sx={{
                    color: "primary.light",
                  }}
                />
              </IconButton>

              {user && (
                <Button
                  sx={{
                    color: "secondary.main",
                    backgroundColor: "primary.light",
                  }}
                  onClick={handleSignOut}
                  color="inherit"
                >
                  Sign out
                </Button>
              )}
            </>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
