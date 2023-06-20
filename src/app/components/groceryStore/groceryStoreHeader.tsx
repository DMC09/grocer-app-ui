"use client";

import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GroceryStoreType } from "@/types";
import GroceryStoreHeaderMenu from "./groceryStoreHeaderMenu";
import { theme } from "@/app/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";

export default function GroceryStoreHeader(groceryStore: GroceryStoreType) {
  const [groceryStoreToRender, setGroceryStoreToRender] =
    useState(groceryStore);
  const { supabase } = useSupabase();

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystore-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "grocerystores",
          filter: `id=eq.${groceryStore.id}`,
        },
        (payload) => setGroceryStoreToRender(payload.new as GroceryStoreType)
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  // import theme for this.
  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        <Card
          sx={{
            border: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
          }}
        >
          <IconButton
            onClick={() => router.back()}
            aria-label="add to grocery store"
            color="secondary"
            size="large"
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography color="secondary.main" variant="h3">
            {groceryStoreToRender.name}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <GroceryStoreHeaderMenu {...groceryStore} />
          </Box>
        </Card>
      </ThemeProvider>
    </>
  );
}
