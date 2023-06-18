"use client";

import { Container } from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect, useState } from "react";
import { GroceryStoreWithItemsType, GroceryStoreType } from "@/types";
import DashboardHeader from "../components/dashboardHeader";
import { PostgrestError, User } from "@supabase/supabase-js";
import GroceryStore from "../components/groceryStore/groceryStore";
import NoStores from "../components/utils/noStores";


export default function Dashboard() {
  const { supabase, session } = useSupabase();
  const [user, SetUser] = useState<User | null | undefined>(session?.user);

  const [groceryStores, setGroceryStores] = useState<
    GroceryStoreType[] | [] | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedDashboard, SetExpandedDashboard] = useState<boolean | null>(
    null
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
      console.log(data.expanded_dashboard, "thing");
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
  }, [supabase,expandedDashboard]);

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

  useEffect(() => {
    const channel = supabase
      .channel("custom-profiles-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        (payload) => SetExpandedDashboard(payload.new.expanded_dashboard)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // TODO: Put this in to a componeont
  const groceryStoresToRender = groceryStores?.map(
    (groceryStore: GroceryStoreType) => {
      return <GroceryStore key={groceryStore.id} expanded={expandedDashboard} groceryStore={groceryStore}  />;
    }
  );
  return (
    <>
      <DashboardHeader />
      <Container
      disableGutters
        maxWidth={false}
        sx={{
          height: '100%',
          display: "flex",
          border:5,
          gap:2,
          flexFlow: "column",
          alignItems: "center",
          backgroundColor: "primary.main",
          overflowY: "scroll",
        }}
      >
        {/* this needs it's own container */}
        {groceryStores && groceryStores.length > 0 ? (
          groceryStoresToRender
        ) : (
          <NoStores />
        )}
      </Container>
    </>
  );
}
