"use client";

import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import GroceryStoreHeaderMenu from "./groceryStoreHeaderMenu";

import { theme } from "@/helpers/theme";

import { ThemeProvider } from "@emotion/react";
import useZustandStore from "@/hooks/useZustandStore";
import { GroceryDataStore } from "@/stores/GroceryDataStore";

export default function GroceryStoreHeader() {
  const { store_id } = useParams();

  const groceryStoreData = useZustandStore(
    GroceryDataStore,
    (state) => state?.data
  )?.filter(
    (grocerystore) => Number(grocerystore.id) === Number(store_id)
  )?.[0];

  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        {groceryStoreData && (
          <Card
            sx={{
              mt: 1,
              boxShadow: 0,
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <IconButton
              onClick={() => router.back()}
              aria-label="Go back to dashboard"
              color="primary"
              size="large"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Typography color="primary.main" variant="h5">
              {groceryStoreData?.name}
            </Typography>
            <Box sx={{ display: "flex", marginLeft: "auto" }}>
              <GroceryStoreHeaderMenu {...groceryStoreData} />
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
