"use client";

import { Button, Container, Skeleton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import data from "../../../../assets/groceryStoreItems.json";
import GroceryStoreItem from "@/app/components/groceryStore/grocerystoreitem";
import { useSupabase } from "@/app/components/supabase/supabase-provider";
import { memo, useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import { getGroceryStoreItems } from "@/app/utils/client/getData";
import NoItems from "@/app/components/utils/noItems";

// initilize the logic, also the real time logic?
//realtime
// no items/
//Make a utils function for getting the stuff and wrap it in the cache
// https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache

export default function Page() {
  const { supabase } = useSupabase();
  const { grocerystoreId } = useParams();

  const [groceryStoreItemsToRender, setGroceryStoreItemsToRender] = useState<
    GroceryStoreItemType[] | []
  >([]);

  async function getGroceryStoreItems() {
    console.log("fetching data");
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .select("*")
      .eq("storeId", grocerystoreId);
    if (data) {
      console.log(groceryStoreItemsToRender, "data before setting!");
      setGroceryStoreItemsToRender(data);
      console.log(groceryStoreItemsToRender, "data after setting!");
    } else if (error) {
      throw new Error(error.message);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel("changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "grocerystoreitems",
          filter: `storeId=eq.${grocerystoreId}`,
        },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `storeId=eq.${grocerystoreId}`,
        },
        getGroceryStoreItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    getGroceryStoreItems();
  }, []);

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          gap: 3,
          my: 2,
        }}
      >
        {groceryStoreItemsToRender.length > 0 ? (
          groceryStoreItemsToRender.map((item) => (
            <GroceryStoreItem key={item.id} {...item} />
          ))
        ) : (
          <NoItems/>
        )}
      </Container>
    </>
  );
}
