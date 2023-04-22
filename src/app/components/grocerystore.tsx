"use client";

import {
  Badge,
  Box,
  CardContent,
  Collapse,
  Container,
  Divider,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroceryStoreItem from "./grocerystoreitem";
import { useEffect, useState } from "react";
import { GroceryStoreItemType, GroceryStoreWithItemsType } from "@/types";
import { theme } from "../utils/theme";
import { useSupabase } from "../supabase-provider";

export default function GroceryStore(data: any) {
  const [open, setOpen] = useState(false);
  const { supabase } = useSupabase();
  const [groceryStore, setGroceryStore] =
    useState<GroceryStoreWithItemsType>(data);


  //use effect to set up the realtime update.
  const groceryStoreItemsToRender = groceryStore.grocerystoreitems.map(
    (grocerystoreitem: GroceryStoreItemType) => {
      return (
        <GroceryStoreItem key={grocerystoreitem.id} {...grocerystoreitem} />
      );
    }
  );

  useEffect(() => {
    const channel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `storeId=eq.${groceryStore.id}`,
        },
        (payload) => {
          console.log("Delete received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          sx={{
            p: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: 1,
            borderColor: "error.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              m: 6,
              bgcolor: "background.paper",
              borderRadius: 1,
              border: 1,
              borderColor: "error.main",
            }}
          >
            <Typography variant="h1" color="text.secondary">
              {data.name}
            </Typography>

            <IconButton
              onClick={() => setOpen(!open)}
              aria-label="expand"
              size="small"
            >
              {open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <Badge badgeContent={data?.quantity} color="secondary">
                  <TocOutlinedIcon color="error" />
                </Badge>
              )}
            </IconButton>
          </Box>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              <Container
                sx={{
                  border: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  bgcolor: "background.paper",
                  borderRadius: 10,
                  borderColor: "primary.main",
                }}
                style={{ overflowX: "scroll" }}
              >
                {groceryStoreItemsToRender.length > 0 ? (
                  groceryStoreItemsToRender
                ) : (
                  <p>There are no items!</p>
                )}
              </Container>
            </CardContent>
          </Collapse>
        </Container>
      </ThemeProvider>
    </>
  );
}
