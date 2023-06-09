"use client";

import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GroceryStoreType } from "@/types";
import AddItem from "../utils/addItem";
import GroceryStoreHeaderMenu from "./groceryStoreHeaderMenu";
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

  const router = useRouter();
  return (
    <>
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
        <Typography color="#EAEAEA" variant="h3">
          {groceryStoreToRender.name}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <AddItem
            store_id={groceryStore.id}
            select_id={groceryStore.select_id}
          />
          <GroceryStoreHeaderMenu {...groceryStore} />
        </Box>
      </Card>
    </>
  );
}
