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

// https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache

export default function Page() {
  const { supabase } = useSupabase();
  const { grocerystore_id } = useParams();

  const [groceryStoreItemsToRender, setGroceryStoreItemsToRender] = useState<
    GroceryStoreItemType[] | []
  >([]);

  async function getGroceryStoreItems() {
    console.log("fetching data");
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .select("*")
      .eq("store_id", grocerystore_id);
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
          filter: `store_id=eq.${grocerystore_id}`,
        },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `store_id=eq.${grocerystore_id}`,
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
      maxWidth={false}
        sx={{
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          gap: 3,
          py:2,
          backgroundColor:"primary.light"
        }}
      >
        {groceryStoreItemsToRender.length > 0 ? (
          groceryStoreItemsToRender.map((item) => (
            <GroceryStoreItem key={item.id} {...item} />
          ))
        ) : (
          <NoItems />
        )}
      </Container>
    </>
  );
}
