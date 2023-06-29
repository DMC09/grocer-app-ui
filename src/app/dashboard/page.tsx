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
import { useGroceryStoreStore } from "@/state/store";
import {
  getAllGroceryStoresalt,
  isGroceryStoreDataEmpty,
} from "../utils/client/groceryStore";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";

export default function Dashboard() {
  // move all listeners to the main supabase listners
  const { supabase, session } = useSupabase();
  const [user, SetUser] = useState<User | null | undefined>(session?.user);

  const [groceryStores, setGroceryStores] = useState<
    GroceryStoreType[] | [] | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedDashboard, SetExpandedDashboard] = useState<boolean | null>(
    null
  );

  const GroceryStoreData = useStore(
    useGroceryStoreStore,
    (state) => state?.data
  );

  async function getDashboardView() {
    const { data, error } = await supabase
      .from("profiles")
      .select("expanded_dashboard")
      .eq("id", session?.user.id)
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      data && SetExpandedDashboard(data.expanded_dashboard);
    }
  }

  const getAllGroceryStores = async () => {
    const {
      data,
      error,
    }: { data: GroceryStoreType[] | [] | null; error: PostgrestError | null } =
      await supabase.from("grocerystores").select("*");
    if (data) {
      setIsLoading(false);
      setGroceryStores(data);
    } else if (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllGroceryStores();
    getDashboardView();
  }, [supabase, expandedDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystore-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function getData() {
    console.log("getting data!");
    await getAllGroceryStoresalt(supabase);
  }
  useEffect(() => {
    if (GroceryStoreData) {
      if (isGroceryStoreDataEmpty(GroceryStoreData)) {
        console.log("no data cached or in state!");
        getData();
      } else {
        console.log("we have cached data!");
      }
    }
    // getData();
  }, [GroceryStoreData]);

  // TODO: Put this in to a componeont
  const groceryStoresToRender = groceryStores?.map(
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
          {groceryStores && groceryStores.length > 0 ? (
            groceryStoresToRender
          ) : (
            <NoStores />
          )}
        </ReactPullToRefresh>
      </Container>
    </>
  );
}
