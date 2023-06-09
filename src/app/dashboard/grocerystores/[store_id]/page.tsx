"use client";

import { Button, Container, Skeleton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import GroceryStoreItem from "@/app/components/groceryStore/grocerystoreitem";
import { useSupabase } from "@/app/components/supabase/supabase-provider";
import { memo, useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import { getGroceryStoreItems } from "@/app/utils/client/getData";
import NoItems from "@/app/components/utils/noItems";
import { PostgrestError } from "@supabase/supabase-js";

// https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache

export default function Page() {
  const { supabase } = useSupabase();
  const { store_id } = useParams();

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
    getGroceryStoreItems();
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
          groceryStoreItemsToRender.map((item) => {
            return <GroceryStoreItem key={item.id} {...item} />;
          })
        ) : (
          <NoItems />
        )}
      </Container>
    </>
  );
}
