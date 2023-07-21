"use client";

import { Box, CircularProgress, Container, Skeleton } from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect, useState } from "react";
import { GroceryStoreType } from "@/types";
import DashboardHeader from "../components/dashboard/dashboardHeader";
import GroceryStore from "../components/groceryStore/groceryStore";
import NoStores from "../components/utils/noStores";
import useStore from "../hooks/useStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  getAllGroceryStoresData,
  isGroceryStoreDataEmpty,
} from "../utils/client/groceryStore";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";
import PullToRefresh from "react-simple-pull-to-refresh";
import DashBoardSkeleton from "../components/skeletons/dashboardSkeleton";
import GroceryStoreSkeleton from "../components/skeletons/groceryStoreSkeleton";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean | null>(null);
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
    setLoading(true);
    await getData();
    if (groceryStoreData) {
      setLoading(false);
    }
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
        {loading ? (
          <>
            <GroceryStoreSkeleton />
          </>
        ) : (
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
                <PullToRefresh
                  refreshingContent={<CircularProgress />}
                  pullingContent={""}
                  onRefresh={handleRefresh}
                >
                  <ul>{groceryStoresToRender}</ul>
                </PullToRefresh>
              </Container>
            ) : (
              <NoStores />
            )}
          </Container>
        )}
      </Container>
    </>
  );
}
