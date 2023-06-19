"use client";

import { ThemeProvider, Typography, Card, Box } from "@mui/material";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useState } from "react";
import { theme } from "../utils/theme";
import { User } from "@supabase/supabase-js";
import AddStore from "./utils/addStore";
import { getSelectId } from "../utils/client/profile";

export default function DashboardHeader() {
  const { supabase, session } = useSupabase();
  const [selectId, setSelectId] = useState<string | null>(null);
  const [user, SetUser] = useState<User | null | undefined>(session?.user);

  //import utils function

  async function getData() {
    if (user?.id) {
      const data = await getSelectId(supabase, user?.id);
      data && setSelectId(data);
    }
  }
  useEffect(() => {
    if (session?.user && session?.user.id) {
      getData();
    }
  }, [supabase]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        {selectId && (
          <Card
            sx={{
              display: "flex",
              flexFlow: "row",
              backgroundColor: "primary.main",
              justifyContent: "space-between",
            }}
          >
            <div></div>
            <Typography color="secondary.main" variant="h3">
              Dashboard
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddStore select_id={selectId} />
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
