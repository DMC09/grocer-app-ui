"use client";

import { CircularProgress, Container } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardView } from "@/types";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useSupabase } from "@/components/supabase/supabase-provider";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import GroceryStoreSkeleton from "@/components/skeletons/groceryStoreSkeleton";
import useZustandStore from "@/hooks/useZustandStore";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  fetchAllItems,
  fetchAllGroceryStores,
  isItemsStateEmpty,
} from "@/helpers/groceryStore";
import { fetchAllCommonItems } from "@/helpers/commonItem";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { ItemDataStore } from "@/stores/ItemStore";
import AllItemsView from "@/components/dashboard/allItems";
import AllStoresView from "@/components/dashboard/allStoresView";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean | null>(null);

  const { supabase, session } = useSupabase();

  const groceryStores = useZustandStore(
    GroceryDataStore,
    (state) => state?.groceryStores
  );
  const itemsData = useZustandStore(ItemDataStore, (state) => state.data);

  const dashboardView = useZustandStore(
    ProfileDataStore,
    (state) => state?.dashboardView
  );

  const fetchData = useCallback(() => {
    async function fetchDataInternal() {
      await fetchAllItems(supabase);
      await fetchAllCommonItems(supabase);
      await fetchAllGroceryStores(supabase);
    }

    fetchDataInternal();
  }, [supabase]);

  useEffect(() => {
    if (itemsData) {
      if (isItemsStateEmpty(itemsData)) {
        console.log("No data found!");
        fetchData();
      } else {
        console.log("Using Cache");
      }
    }
  }, [fetchData, itemsData]);

  async function handleRefresh() {
    setLoading(true);
    await fetchData();
    if (itemsData) {
      setLoading(false);
    }
    if (itemsData) {
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
              {dashboardView === DashboardView.AllItemsView ? (
                <AllItemsView items={itemsData} />
              ) : (
                <AllStoresView groceryStores={groceryStores} />
              )}
            </Container>
          </PullToRefresh>
        )}
      </Container>
    </>
  );
}
