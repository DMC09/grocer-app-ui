"use client";

import {  Container, Skeleton } from "@mui/material";
import { useParams } from "next/navigation";
import GroceryStoreItem from "@/app/components/groceryStore/grocerystoreitem";
import { useSupabase } from "@/app/components/supabase/supabase-provider";
import {  useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import NoItems from "@/app/components/utils/noItems";
import { PostgrestError } from "@supabase/supabase-js";

// need to grab the pfiles boolean and render the differnt view.

export default function Page() {
  const { supabase,session } = useSupabase();
  const { store_id } = useParams();
  const [expandedDashboard, SetExpandedDashboard] = useState<boolean | null>(
    null
  );

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
        (payload) => SetExpandedDashboard(payload.new.expanded_groceryitem)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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

  const [groceryStoreItemsToRender, setGroceryStoreItemsToRender] = useState<
    GroceryStoreItemType[] | [] | null
  >([]);

  async function getGroceryStoreItems() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .select("*")
      .eq("store_id", store_id);
    if (data) {
      setGroceryStoreItemsToRender(data as GroceryStoreItemType[] | []);
    } else if (error) {
      throw new Error(error.message);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystoreitems-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "grocerystoreitems",
          filter: `store_id=eq.${store_id}`,
        },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `store_id=eq.${store_id}`,
        },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `store_id=eq.${store_id}`,
        },
        getGroceryStoreItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if(session?.user){

      getGroceryStoreItems();
      getDashboardView();
    }
  }, []);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          height: "85%",
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "primary.light",
          overflowY: "scroll",
          gap: 3.5,
          py: 4,
          border: 2,
        }}
      >
        {groceryStoreItemsToRender && groceryStoreItemsToRender.length > 0 ? (
          groceryStoreItemsToRender.map((item:GroceryStoreItemType) => {
            return <GroceryStoreItem key={item.id} expanded={expandedDashboard} groceryStoreItem={item} />;
          })
        ) : (
          <NoItems />
        )}
      </Container>
    </>
  );
}
