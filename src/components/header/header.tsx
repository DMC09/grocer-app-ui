"use client";

import { Box, AppBar, Toolbar, IconButton, ThemeProvider } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "../supabase/supabase-provider";
import { theme } from "@/helpers/theme";
import HeaderMenu from "./headerMenu";


export default function Header() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{}}>
        {/* must keep this so it always stays!! */}
        <AppBar sx={{ backgroundColor: "primary.dark" }} position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <>
              {session?.user && (
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
              )}
              {session?.user && <HeaderMenu />}
            </>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
