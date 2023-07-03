"use client";

import { Container } from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect, useState } from "react";
import { GroceryStoreWithItemsType, GroceryStoreType } from "@/types";
import DashboardHeader from "../components/dashboardHeader";
import { PostgrestError, User } from "@supabase/supabase-js";
import GroceryStore from "../components/groceryStore/groceryStore";
import NoStores from "../components/utils/noStores";
import useStore from "../hooks/useStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
import {
  getAllGroceryStoresalt,
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
    console.log("getting data!");
    await getAllGroceryStoresalt(supabase);
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
        maxWidth={false}
        sx={{
          height: "100%",
          display: "flex",
          border: 5,
          gap: 2,
          flexFlow: "column",
          alignItems: "center",
          backgroundColor: "primary.main",
          overflowY: "scroll",
        }}
      >
        <ReactPullToRefresh
          onRefresh={handleRefresh}
          style={{ textAlign: "center" }}
        >
          {/* this needs it's own container */}
          {groceryStoreData && groceryStoreData.length > 0 ? (
            groceryStoresToRender
          ) : (
            <NoStores />
          )}
        </ReactPullToRefresh>
      </Container>
    </>
  );
}
