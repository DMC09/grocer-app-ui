"use client";

import { CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { GroceryStoreType } from "@/types";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useSupabase } from "@/components/supabase/supabase-provider";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import GroceryStore from "@/components/groceryStore/groceryStore";
import GroceryStoreSkeleton from "@/components/skeletons/groceryStoreSkeleton";

import NoStores from "@/components/utils/grocerystore/nostores";
import useZustandStore from "@/hooks/useZustandStore";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  getAllGroceryStoresData,
  isGroceryStoreDataEmpty,
} from "@/helpers/groceryStore";
import { getAllCommonItems } from "@/helpers/commonItem";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const groceryStoreData = useZustandStore(
    GroceryDataStore,
    (state) => state?.data
  );
  const { supabase, session } = useSupabase();

  async function fetchData() {
    await getAllGroceryStoresData(supabase);
    await getAllCommonItems(supabase);
  }
  useEffect(() => {
    if (groceryStoreData) {
      if (isGroceryStoreDataEmpty(groceryStoreData)) {
        console.log("Grocery Store Data not found!");
        fetchData();
      } else {
        console.log("Using Cache");
      }
    }
  }, [groceryStoreData]);

  // TODO: Put this in to a componeont
  const groceryStoresToRender = groceryStoreData?.map(
    (groceryStore: GroceryStoreType) => {
      return <GroceryStore key={groceryStore.id} groceryStore={groceryStore} />;
    }
  );

  async function handleRefresh() {
    setLoading(true);
    setLoading(true);
    await fetchData();
    if (groceryStoreData) {
      setLoading(false);
    }
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
