"use client";

import { Container, Skeleton, ThemeProvider } from "@mui/material";

import { useParams } from "next/navigation";
import { GroceryStoreItemType } from "@/types";
import NoItems from "@/app/components/utils/noItems";
import { PostgrestError } from "@supabase/supabase-js";
import { theme } from "@/app/utils/theme";
import useStore from "@/app/hooks/useStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
import { useProfileStore } from "@/state/ProfileStore";
import GroceryStoreItem from "@/app/components/groceryStore/groceryStoreItem/grocerystoreitem";
import ExpandedGroceryStoreItem from "@/app/components/groceryStore/groceryStoreItem/expandedItem";

// need to grab the pfiles boolean and render the differnt view.

export default function Page() {
  const { store_id } = useParams();
  const expandedView = useStore(
    useProfileStore,
    (state) => state?.data?.expanded_groceryitem
  );
  const grocerystoreitems = useStore(
    useGroceryStoreStore,
    (state) => state?.data
  )?.filter((grocerystore) => Number(grocerystore.id) === Number(store_id))?.[0]
    .grocerystoreitems;

  const groceryStoreItemsToRender = grocerystoreitems?.map(
    (item: GroceryStoreItemType) => {
      return expandedView ? (
        <ExpandedGroceryStoreItem key={item.id} groceryStoreItem={item} />
      ) : (
        <GroceryStoreItem key={item.id} groceryStoreItem={item} />
      );
    }
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        {grocerystoreitems && grocerystoreitems.length > 0 ? (
          <Container
            disableGutters
            sx={{
              mt: 2,
              height: "100%",
              width: "95%",
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            {groceryStoreItemsToRender}
          </Container>
        ) : (
          <NoItems />
        )}

      </ThemeProvider>
    </>
  );
}
