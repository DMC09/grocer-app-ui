"use client";

import { Box, Container } from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect } from "react";
import { GroceryStoreType } from "@/types";
import DashboardHeader from "../components/dashboard/dashboardHeader";
import GroceryStore from "../components/groceryStore/groceryStore";
import NoStores from "../components/utils/noStores";
import useStore from "../hooks/useStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
import {
  getAllGroceryStoresData,
  isGroceryStoreDataEmpty,
} from "../utils/client/groceryStore";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";

export default function Dashboard() {
  const groceryStoreData = useStore(
    useGroceryStoreStore,
    (state) => state?.data
  );
  const { supabase, session } = useSupabase();

  async function getData() {
    await getAllGroceryStoresData(supabase);
  }
  useEffect(() => {
    if (groceryStoreData) {
      if (isGroceryStoreDataEmpty(groceryStoreData)) {
        console.log("no data cached or in state!");
        getData();
      } else {
        console.log("we have cached data!");
      }
    }
    // getData();
  }, [groceryStoreData]);

  // TODO: Put this in to a componeont
  const groceryStoresToRender = groceryStoreData?.map(
    (groceryStore: GroceryStoreType) => {
      return <GroceryStore key={groceryStore.id} groceryStore={groceryStore} />;
    }
  );

  async function handleRefresh() {
    console.log("Pull to refresh Choida!");
    await getData();
  }

  return (
    <>
      <DashboardHeader />

      <Container
        disableGutters
        sx={{
          height: "100%",
          display: "flex",
          flexFlow: "column",
          backgroundColor: "white",
          overflowY: "scroll",
        }}
      >
        <Container
          disableGutters
          sx={{ height: "100%", width: "98%", overflowY: "scroll" }}
        >
          {groceryStoreData && groceryStoreData.length > 0 ? (
            <Container
              disableGutters
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexFlow: "column",
                justifyContent: "flex-start",
                backgroundColor: "white",
                overflowY: "scroll",
              }}
            >
              <ReactPullToRefresh onRefresh={handleRefresh}>
                {groceryStoresToRender}
              </ReactPullToRefresh>
            </Container>
          ) : (
            <NoStores />
          )}
        </Container>
      </Container>
    </>
  );
}
