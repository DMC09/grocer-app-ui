"use client";

import { ThemeProvider, Typography, Card } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useCallback, useEffect, useMemo, useState } from "react";

import { theme } from "../utils/theme";
import { PostgrestError } from "@supabase/supabase-js";
import AddStore from "./utils/addStore";

export default function DashboardHeader() {
  //TODO: move the add store logic to it's own file.
  const { supabase, session } = useSupabase();

  const [selectId, setSelectId] = useState<string | null>(null);

  useEffect(() => {
    async function getSelectId() {
      const { data, error } = await supabase
        .from("profiles")
        .select("select_id")
        .single();
      if (error) {
        throw new Error(error.message);
      } else {
        setSelectId(data?.select_id);
      }
    }

    getSelectId();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        {selectId && <Card
          sx={{
            display: "flex",
            flexFlow: "row",
            backgroundColor: "primary.main",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <Typography align="center" color="#EAEAEA" variant="h3">
            Dashboard
          </Typography>
          <AddStore select_id={selectId} />
        </Card>}
      </ThemeProvider>
    </>
  );
}
