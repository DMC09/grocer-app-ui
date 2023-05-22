"use client";

import { Box, AppBar, Toolbar, IconButton } from "@mui/material";
import { Typography, Button } from "@supabase/ui";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import HomeIcon from "@mui/icons-material/Home";
import { useParams, useRouter } from "next/navigation";

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
    <Box  sx={{ display: "flex", justifyContent: "center",backgroundColor:"primary.main" }}>
      <AppBar sx={{}} position="static">
        <Toolbar sx={{ justifyContent: "right" }}>
          <>
            <IconButton onClick={() => router.push("/")}>
              <HomeIcon />
            </IconButton>

            {user && (
              <Button onClick={handleSignOut} color="inherit">
                Sign out
              </Button>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
