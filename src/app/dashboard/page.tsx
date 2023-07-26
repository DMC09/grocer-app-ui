"use client";

import { CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { GroceryStoreType } from "@/types";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useSupabase } from "@/components/supabase/supabase-provider";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import GroceryStore from "@/components/groceryStore/groceryStore";
import GroceryStoreSkeleton from "@/components/skeletons/groceryStoreSkeleton";
import {
  getAllGroceryStoresData,
  isGroceryStoreDataEmpty,
} from "@/utils/client/groceryStore";
import NoStores from "@/components/utils/noStores";
import useZustandStore from "@/hooks/useZustandStore";
import { GroceryDataStore } from "@/stores/GroceryDataStore";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const groceryStoreData = useZustandStore(
    GroceryDataStore,
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
          <PullToRefresh
            refreshingContent={<CircularProgress />}
            pullingContent={""}
            onRefresh={handleRefresh}
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
                  <ul>{groceryStoresToRender}</ul>
                </Container>
              ) : (
                <NoStores />
              )}
            </Container>
          </PullToRefresh>
        )}
      </Container>
    </>
  );
}
